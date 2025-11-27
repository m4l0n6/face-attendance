import {
  Card,
  CardFooter,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, User, Hash, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { useEffect, useState } from "react";
import { useClassStore } from "@/stores/classes";
import { useNotificationStore } from "@/stores/notification";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [api, setApi] = useState<CarouselApi>();
  const { classes, fetchClasses } = useClassStore();
  const token = useAuthStore((state) => state.token);
  const { notifications, fetchNotifications } =
     useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchNotifications(token, false);
    }
}, [token, fetchNotifications]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Carousel 
  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      // Kiểm tra nếu đã đến slide cuối cùng
      if (!api.canScrollNext()) {
        // Scroll về đầu sau một chút delay
        setTimeout(() => {
          api.scrollTo(0);
        }, 300);
      }
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
        <Card className="@container/card md:col-span-2 max-h-72 overflow-hidden">
          <CardHeader>
            <CardTitle className="md:mt-5 md:ml-5 font-semibold tabular-nums text-gray-800 text-2xl @[250px]/card:text-3xl">
              Xin chào, {user?.displayName}
            </CardTitle>
            <div className="hidden md:block relative w-full h-16">
              <img
                src="graduation.avif"
                alt="Graduation"
                className="hidden md:block -top-16 right-0 absolute md:w-40 md:h-40 object-cover"
              />
            </div>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="flex justify-between items-center font-semibold tabular-nums @[250px]/card:text-xl text-2xl">
              <div>Lịch học</div>
              <Button
                variant="link"
                className="text-sm"
                onClick={() => navigate("/schedule")}
              >
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="line-clamp-2">
            {notifications.length === 0 ? (
              <div className="h-full text-muted-foreground text-center">
                Không có lịch học hôm nay.
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">
                {notifications[0].message}
              </span>
            )}
          </CardContent>
          {notifications.length > 0 && (
            <CardFooter className="flex justify-between">
              <div>
                {format(new Date(notifications[0].createdAt), "dd/MM/yyyy")}
              </div>
              {notifications[0].isRead ? (
                <Badge variant="secondary"  >Đã đọc</Badge>
              ) : (
                <Badge>Chưa đọc</Badge>
              )}
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Classes Carousel */}
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="font-semibold text-xl">Lớp học</div>
          <div className="flex gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </div>
        <CarouselContent>
          {classes.map((classItem) => (
            <CarouselItem
              key={classItem.id}
              className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/classes/${classItem.id}`)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{classItem.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Hash className="w-4 h-4" />
                    <span className="text-xs">{classItem.code}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span className="text-xs">{classItem.lecturerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">
                      {classItem.schedules[0].room}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">
                      {classItem.schedules[0].startTime} -{" "}
                      {classItem.schedules[0].endTime}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Guide and calendar */}
      <div>
        {/* Quick Guide */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="font-semibold text-xl">
              Hướng dẫn nhanh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="flex justify-center items-center bg-primary rounded-full w-10 h-10 font-bold text-white shrink-0">
                    1
                  </div>
                  <div className="flex-1 mt-2 border-border border-l-2 w-0 h-full" />
                </div>
                <div className="flex-1 pb-6">
                  <h4 className="mb-1 font-semibold text-foreground text-lg">
                    Điểm danh khuôn mặt
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Sử dụng công nghệ nhận diện khuôn mặt để điểm danh nhanh
                    chóng và chính xác
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="flex justify-center items-center bg-muted border-2 border-border rounded-full w-10 h-10 font-semibold text-muted-foreground shrink-0">
                    2
                  </div>
                  <div className="flex-1 mt-2 border-border border-l-2 w-0 h-full" />
                </div>
                <div className="flex-1 pb-6">
                  <h4 className="mb-1 font-semibold text-muted-foreground text-lg">
                    Quản lý lớp học
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Xem và quản lý các lớp học bạn đang tham gia một cách dễ
                    dàng
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="flex justify-center items-center bg-muted border-2 border-border rounded-full w-10 h-10 font-semibold text-muted-foreground shrink-0">
                    3
                  </div>
                  <div className="flex-1 mt-2 border-border border-l-2 w-0 h-full" />
                </div>
                <div className="flex-1 pb-6">
                  <h4 className="mb-1 font-semibold text-muted-foreground text-lg">
                    Quản lý lịch học
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Xem và quản lý lịch học của bạn một cách hiệu quả
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="flex justify-center items-center bg-muted border-2 border-border rounded-full w-10 h-10 font-semibold text-muted-foreground shrink-0">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 font-semibold text-muted-foreground text-lg">
                    Nhận thông báo
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Nhận thông báo thời gian thực từ giảng viên và nhà trường
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
