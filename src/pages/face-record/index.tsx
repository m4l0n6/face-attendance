import CameraView from "@/components/camera";
import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  loadFaceApiModels,
  detectFace,
  drawDetections,
  captureFaceDescriptor,
  compareFaces,
} from "@/utils/faceDetection";
import {
  saveFaceDescriptor,
  getAllFaceDescriptors,
  getFaceCount,
} from "@/utils/faceStorage";
import { Input } from "@/components/ui/input";

const FaceRecordPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [capturedDescriptor, setCapturedDescriptor] = useState<Float32Array | null>(null);
  const [currentEmbeddings, setCurrentEmbeddings] = useState<Float32Array[]>([]);
  const [error, setError] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [savedFacesCount, setSavedFacesCount] = useState<number>(0);
  const [mode, setMode] = useState<"register" | "attendance">("register");

  useEffect(() => {
    const initModels = async () => {
      try {
        await loadFaceApiModels();
        setIsModelLoaded(true);
        setSavedFacesCount(getFaceCount());
      } catch (err) {
        setError("Không thể tải models. Vui lòng tải models vào thư mục /public/models");
        console.error(err);
      }
    };
    initModels();
  }, []);

  const handleVideoReady = useCallback((video: HTMLVideoElement) => {
    videoRef.current = video;
  }, []);

  const startDetection = () => {
    if (!isModelLoaded) {
      setError("Models chưa được tải!");
      return;
    }
    setIsDetecting(true);
    setError("");
  };

  const stopDetection = () => {
    setIsDetecting(false);
  };

  const switchMode = (newMode: "register" | "attendance") => {
    setMode(newMode);
    setError("");
    setCapturedDescriptor(null);
  };

  const captureFace = async () => {
    if (!videoRef.current) return;

    if (mode === "register" && !userName.trim()) {
      toast.error("Vui lòng nhập tên trước khi ghi nhận khuôn mặt!");
      return;
    }

    try {
      const descriptor = await captureFaceDescriptor(videoRef.current);
      if (descriptor) {
        if (mode === "register") {
          // Chế độ đăng ký: Lưu vào localStorage
          saveFaceDescriptor(userName.trim(), descriptor);
          setCapturedDescriptor(descriptor);
          setSavedFacesCount(getFaceCount());
          setError("");
          toast.success(`Khuôn mặt của "${userName.trim()}" đã được lưu!`);
          setUserName("");
        } else {
          // Chế độ điểm danh: So sánh với các khuôn mặt đã lưu
          const savedFaces = getAllFaceDescriptors();
          let matched = false;
          let matchedName = "";
          let bestSimilarity = 0;

          for (const [name, savedDescriptorArray] of Object.entries(savedFaces)) {
            const savedDescriptor = new Float32Array(savedDescriptorArray);
            const isMatch = compareFaces(descriptor, savedDescriptor, 0.6);
            
            // Tính độ tương đồng (1 - distance)
            const distance = Math.sqrt(
              descriptor.reduce((sum, val, i) => sum + Math.pow(val - savedDescriptor[i], 2), 0)
            );
            const similarity = Math.max(0, 1 - distance);

            if (isMatch && similarity > bestSimilarity) {
              matched = true;
              matchedName = name;
              bestSimilarity = similarity;
            }
          }

          if (matched) {
            toast.success(`Điểm danh thành công: ${matchedName} (${(bestSimilarity * 100).toFixed(1)}%)`);
            setError("");
          } else {
            toast.error("Không tìm thấy khuôn mặt khớp trong hệ thống!");
          }
        }
      } else {
        setError("Không phát hiện khuôn mặt. Vui lòng thử lại!");
      }
    } catch (err) {
      setError("Lỗi khi xử lý khuôn mặt");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isDetecting || !videoRef.current || !canvasRef.current) return;

    const interval = setInterval(async () => {
      if (videoRef.current && canvasRef.current) {
        try {
          const detections = await detectFace(videoRef.current);
          setFaceCount(detections.length);

          // Lấy embeddings từ các khuôn mặt phát hiện được
          const embeddings = detections.map(d => d.descriptor);
          setCurrentEmbeddings(embeddings);

          // Log embeddings ra console
          if (embeddings.length > 0) {
            console.log(`Phát hiện ${embeddings.length} khuôn mặt với embeddings:`, embeddings);
          }

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

  return (
    <div className="mx-auto p-4 sm:p-6 max-w-4xl container">
      <h1 className="mb-4 sm:mb-6 font-bold text-2xl sm:text-3xl text-center">
        Ghi hình khuôn mặt điểm danh
      </h1>

      {/* Mode Switcher */}
      <Card className="mb-4 sm:mb-6 p-3 sm:p-4">
        <div className="flex sm:flex-row flex-col justify-center gap-2 sm:gap-3">
          <Button
            onClick={() => switchMode("register")}
            variant={mode === "register" ? "default" : "outline"}
            size="lg"
            className="w-full sm:w-auto"
          >
            Đăng ký khuôn mặt
          </Button>
          <Button
            onClick={() => switchMode("attendance")}
            variant={mode === "attendance" ? "default" : "outline"}
            size="lg"
            className="w-full sm:w-auto"
          >
            Điểm danh
          </Button>
        </div>
        <div className="mt-3 text-center">
          <Badge variant="secondary">
            Đã lưu: {savedFacesCount} khuôn mặt
          </Badge>
        </div>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}


      {mode === "register" && (
        <Card className="mb-4 sm:mb-6 p-3 sm:p-4">
          <label className="block mb-2 font-medium text-sm">
            Nhập tên người dùng:
          </label>
          <Input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Ví dụ: Nguyễn Văn A"
            className="w-full"
          />
        </Card>
      )}

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
              <Button onClick={stopDetection} variant="destructive" size="lg" className="w-full sm:w-auto">
                Dừng phát hiện
              </Button>
              <Button
                onClick={captureFace}
                variant="default"
                size="lg"
                disabled={faceCount === 0}
                className="w-full sm:w-auto"
              >
                {mode === "register" ? "Lưu khuôn mặt" : "Điểm danh"}
              </Button>
            </>
          )}
        </div>
      </Card>

      {currentEmbeddings.length > 0 && (
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
      )}
    </div>
  );
};

export default FaceRecordPage;
