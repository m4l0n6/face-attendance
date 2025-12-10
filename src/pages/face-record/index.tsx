import CameraView from "@/components/camera";
import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  loadFaceApiModels,
  detectFace,
  drawDetections,
  captureFaceDescriptor,
  compareFaces,
} from "@/utils/faceDetection";
import { useAuthStore } from "@/stores/auth";
import { useStudentStore } from "@/stores/students";
import * as faceapi from "face-api.js";
import { mySchedules } from "@/services/schedules/index";
import type { Schedule } from "@/services/schedules/typing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useIPConfigStore } from "@/stores/ip-config";
import { recordAttendance } from "@/services/attendance/index";

const FaceRecordPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [capturedDescriptor, setCapturedDescriptor] = useState<Float32Array | null>(null);
  const [currentEmbeddings, setCurrentEmbeddings] = useState<Float32Array[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State cho điểm danh
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);

  const { fetchStudentInfoById, studentInfo } = useStudentStore();
  const { currentIP, fetchCurrentIP } = useIPConfigStore();

  const { user } = useAuthStore();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (user?.studentInfo) {
      fetchStudentInfoById(user.studentInfo[0].id);
    }
  }, [user, fetchStudentInfoById]);

  useEffect(() => {
    fetchCurrentIP();
  }, [fetchCurrentIP]);

  const studentImage = studentInfo?.faceImage?.imageUrl || null;

  // Load face models
  useEffect(() => {
    const initModels = async () => {
      try {
        await loadFaceApiModels();
        setIsModelLoaded(true);
      } catch (err) {
        toast.error("Không thể tải models. Vui lòng tải models vào thư mục /public/models");
        console.error(err);
      }
    };
    initModels();
  }, []);

  // Load schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      if (token) {
        setIsLoadingSchedules(true);
        try {
          const data = await mySchedules(token);
          // Lọc các buổi học đang có session điểm danh mở
          const activeSchedules = data.filter((schedule: Schedule) => 
            schedule.attendanceSession && 
            schedule.status !== "CANCELLED"
          );
          setSchedules(activeSchedules);
        } catch (err) {
          console.error("Error fetching schedules:", err);
          toast.error("Không thể tải danh sách buổi học");
        } finally {
          setIsLoadingSchedules(false);
        }
      }
    };
    fetchSchedules();
  }, [token]);

  const handleVideoReady = useCallback((video: HTMLVideoElement) => {
    videoRef.current = video;
  }, []);

  const startDetection = () => {
    if (!isModelLoaded) {
      toast.error("Models chưa được tải!");
      return;
    }
    setIsDetecting(true);
  };

  const stopDetection = () => {
    setIsDetecting(false);
  };

  const captureFace = async () => {
    if (!videoRef.current) return;

    try {
      setIsSubmitting(true);
      const descriptor = await captureFaceDescriptor(videoRef.current);
      
      if (!descriptor) {
        toast.error("Không phát hiện khuôn mặt. Vui lòng thử lại!");
        return;
      }

      const studentInfo = user?.studentInfo;
      const studentId = studentInfo && studentInfo.length > 0 ? studentInfo[0].studentId : null;
      
      if (!currentIP?.isAllowed) {
        toast.error("Địa chỉ IP hiện tại không được phép điểm danh!");
        return;
      }
      
      if (!studentId) {
        toast.error("Không tìm thấy thông tin sinh viên!");
        return;
      }

      if (!token) {
        toast.error("Vui lòng đăng nhập lại!");
        return;
      }

      if (!selectedSessionId) {
        toast.error("Vui lòng chọn buổi học cần điểm danh!");
        return;
      }

      // Kiểm tra xem sinh viên đã có ảnh khuôn mặt đăng ký chưa
      if (!studentImage) {
        toast.error("Bạn chưa đăng ký khuôn mặt. Vui lòng liên hệ giáo viên!");
        return;
      }

      // So sánh khuôn mặt với ảnh đã đăng ký
      try {
        console.log("Loading student image:", studentImage);
        
        const img = document.createElement('img');
        img.crossOrigin = 'anonymous';
        img.src = studentImage;
        
        await new Promise((resolve, reject) => {
          img.onload = () => {
            console.log("Image loaded successfully:", img.width, "x", img.height);
            resolve(null);
          };
          img.onerror = (error) => {
            console.error("Image load error:", error);
            reject(error);
          };
        });

        console.log("Detecting face in registered image...");
        const registeredDetection = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({
            inputSize: 224,
            scoreThreshold: 0.3
          }))
          .withFaceLandmarks()
          .withFaceDescriptor();

        console.log("Registered detection:", registeredDetection);

        if (!registeredDetection) {
          toast.error("Không thể phát hiện khuôn mặt trong ảnh đã đăng ký! Vui lòng kiểm tra lại ảnh.");
          return;
        }

        const registeredDescriptor = registeredDetection.descriptor;
        
        // So sánh hai khuôn mặt với ngưỡng 0.6
        const isMatch = compareFaces(descriptor, registeredDescriptor, 0.6);
        
        if (!isMatch) {
          toast.error("Khuôn mặt không khớp với ảnh đã đăng ký!");
          return;
        }

        // Nếu khớp, gọi API điểm danh
        const studentName = user?.displayName || 
                            (studentInfo && studentInfo.length > 0 ? studentInfo[0].name : "Sinh viên");
        
        await recordAttendance(token, {
          sessionId: selectedSessionId,
          studentId: studentId,
          method: "face",
          matchedAt: new Date().toISOString(),
        });
        
        setCapturedDescriptor(descriptor);
        toast.success(`Khuôn mặt khớp thành công: ${studentName}`);
      } catch (error: unknown) {
        console.error("Attendance error:", error);
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { message?: string } } };
          const errorMessage = axiosError.response?.data?.message || "Điểm danh thất bại! Vui lòng thử lại.";
          toast.error(errorMessage);
        } else {
          toast.error("Điểm danh thất bại! Vui lòng thử lại.");
        }
      }
    } catch (err) {
      toast.error("Lỗi khi xử lý khuôn mặt");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Face detection loop
  useEffect(() => {
    if (!isDetecting || !videoRef.current || !canvasRef.current) return;

    const interval = setInterval(async () => {
      if (videoRef.current && canvasRef.current) {
        try {
          const detections = await detectFace(videoRef.current);
          setFaceCount(detections.length);

          const embeddings = detections.map(d => d.descriptor);
          setCurrentEmbeddings(embeddings);

          if (canvasRef.current) {
            drawDetections(canvasRef.current, detections);
          }
        } catch (err) {
          console.error("Detection error:", err);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isDetecting]);

  // Lấy thông tin session đã chọn
  const selectedSchedule = schedules.find(s => s.attendanceSession?.id === selectedSessionId);

  return (
    <div className="mx-auto p-4 sm:p-6 max-w-4xl container">
      <h1 className="mb-4 sm:mb-6 font-bold text-2xl sm:text-3xl text-center">
        Điểm danh khuôn mặt
      </h1>

      {/* Session Selector */}
      {
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Chọn buổi học cần điểm danh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedSessionId}
              onValueChange={setSelectedSessionId}
              disabled={isLoadingSchedules}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoadingSchedules ? "Đang tải..." : "Chọn buổi học"} />
              </SelectTrigger>
              <SelectContent>
                {schedules.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Không có buổi học nào đang mở điểm danh
                  </SelectItem>
                ) : (
                  schedules.map((schedule) => (
                    <SelectItem 
                      key={schedule.attendanceSession?.id || schedule.id} 
                      value={schedule.attendanceSession?.id || ""}
                    >
                      {schedule.sessionName} - {schedule.class?.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Hiển thị thông tin buổi học đã chọn */}
            {selectedSchedule && (
              <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold">{selectedSchedule.sessionName}</h4>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(selectedSchedule.startDateTime), "EEEE, dd/MM/yyyy", { locale: vi })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  <span>
                    {format(new Date(selectedSchedule.startDateTime), "HH:mm")} - {format(new Date(selectedSchedule.endDateTime), "HH:mm")}
                  </span>
                </div>
                {selectedSchedule.schedule?.room && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedSchedule.schedule.room}</span>
                  </div>
                )}
                <div className="pt-2">
                  <Badge variant="secondary">
                    Đã điểm danh: {selectedSchedule.attendanceSession?.attendanceCount || 0} sinh viên
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      }

      {/* Camera View */}
      <Card className="mb-4 sm:mb-6 p-3 sm:p-6">
        <div className="flex justify-center mb-4 overflow-hidden">
          <div className="w-full max-w-full">
            <CameraView
              width={640}
              height={480}
              onVideoReady={handleVideoReady}
              canvasRef={canvasRef}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-4">
          <Badge variant={isModelLoaded ? "default" : "secondary"} className="text-xs sm:text-sm">
            {isModelLoaded ? "Models đã tải" : "Đang tải..."}
          </Badge>
          <Badge variant={faceCount > 0 ? "default" : "outline"} className="text-xs sm:text-sm">
            Phát hiện: {faceCount}
          </Badge>
          {currentEmbeddings.length > 0 && (
            <Badge variant="default" className="bg-blue-600 text-xs sm:text-sm">
              {currentEmbeddings.length} Embedding
            </Badge>
          )}
          {capturedDescriptor && (
            <Badge variant="default" className="bg-green-600 text-xs sm:text-sm">
              ✓ Ghi nhận
            </Badge>
          )}
        </div>

        <div className="flex sm:flex-row flex-col justify-center gap-2 sm:gap-3">
          {!isDetecting ? (
            <Button
              onClick={startDetection}
              disabled={!isModelLoaded}
              size="lg"
              className="w-full sm:w-auto"
            >
              Bắt đầu phát hiện
            </Button>
          ) : (
            <>
              <Button 
                onClick={stopDetection} 
                variant="destructive" 
                size="lg" 
                className="w-full sm:w-auto"
              >
                Dừng phát hiện
              </Button>
              <Button
                onClick={captureFace}
                variant="default"
                size="lg"
                disabled={!studentImage || isSubmitting || !selectedSessionId}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Đang xử lý..." : "Điểm danh"}
              </Button>
            </>
          )}
        </div>
      </Card> 

      {/* Face Embeddings Info */}
      {/* {currentEmbeddings.length > 0 && (
        <Card className="mb-4 sm:mb-6 p-3 sm:p-4">
          <h3 className="mb-2 font-semibold text-sm sm:text-base">Face Embeddings:</h3>
          <div className="space-y-2">
            {currentEmbeddings.map((embedding, idx) => (
              <div key={idx} className="bg-muted p-2 rounded-md">
                <p className="mb-1 font-medium text-xs">Khuôn mặt {idx + 1}:</p>
                <p className="overflow-x-auto font-mono text-[10px] text-muted-foreground sm:text-xs break-all">
                  [{Array.from(embedding).slice(0, 10).map(v => v.toFixed(3)).join(", ")}...]
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Vector 128D (hiển thị 10 giá trị)
                </p>
              </div>
            ))}
          </div>
        </Card>
      )} */}
    </div>
  );
};

export default FaceRecordPage;
