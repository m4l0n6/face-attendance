import {
  Card,
  CardFooter,
  CardHeader,
  CardContent,
  CardAction,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";
import { ArrowRight, BookOpen, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { useAuthStore } from "@/stores/auth";
import { useEffect, useState } from "react";

interface ClassData {
  id: number;
  name: string;
  teacher: string;
  schedule: string;
  room: string;
  progress: number;
}

const mockClasses: ClassData[] = [
  {
    id: 1,
    name: "Lập trình Web",
    teacher: "TS. Nguyễn Văn A",
    schedule: "Thứ 2, 7:30 - 11:30",
    room: "A101",
    progress: 75,
  },
  {
    id: 2,
    name: "Cơ sở dữ liệu",
    teacher: "PGS. Trần Thị B",
    schedule: "Thứ 3, 13:00 - 17:00",
    room: "B203",
    progress: 60,
  },
  {
    id: 3,
    name: "Mạng máy tính",
    teacher: "TS. Lê Văn C",
    schedule: "Thứ 4, 7:30 - 11:30",
    room: "C305",
    progress: 85,
  },
  {
    id: 4,
    name: "Hệ điều hành",
    teacher: "TS. Phạm Thị D",
    schedule: "Thứ 5, 13:00 - 17:00",
    room: "A205",
    progress: 50,
  },
  {
    id: 5,
    name: "Trí tuệ nhân tạo",
    teacher: "PGS. Hoàng Văn E",
    schedule: "Thứ 6, 7:30 - 11:30",
    room: "B104",
    progress: 90,
  },
  {
    id: 6,
    name: "Phân tích thiết kế hệ thống",
    teacher: "TS. Vũ Thị F",
    schedule: "Thứ 2, 13:00 - 17:00",
    room: "C201",
    progress: 70,
  },
  {
    id: 7,
    name: "Kỹ thuật lập trình",
    teacher: "TS. Đỗ Văn G",
    schedule: "Thứ 3, 7:30 - 11:30",
    room: "A302",
    progress: 80,
  },
  {
    id: 8,
    name: "An toàn thông tin",
    teacher: "PGS. Bùi Thị H",
    schedule: "Thứ 4, 13:00 - 17:00",
    room: "B301",
    progress: 65,
  },
];

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [api, setApi] = useState<CarouselApi>();
  const [date, setDate] = useState<Date | undefined>(new Date());

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
        <Card className="@container/card relative md:col-span-2 overflow-hidden">
          <CardHeader className="z-10 relative">
            <CardTitle className="md:mt-5 md:ml-5 font-semibold tabular-nums text-2xl @[250px]/card:text-3xl">
              Xin chào, {user?.displayName} 👋
            </CardTitle>
          </CardHeader>
          {/* Wave Animation */}
          <div className="bottom-0 absolute inset-x-0 opacity-30 h-24">
            <svg
              className="bottom-0 absolute w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
            >
              <path
                fill="var(--primary)"
                fillOpacity="0.3"
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              >
                <animate
                  attributeName="d"
                  dur="10s"
                  repeatCount="indefinite"
                  values="
                    M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                    M0,160L48,149.3C96,139,192,117,288,128C384,139,480,181,576,186.7C672,192,768,160,864,133.3C960,107,1056,85,1152,90.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                    M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
              </path>
              <path
                fill="var(--primary)"
                fillOpacity="0.5"
                d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,154.7C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              >
                <animate
                  attributeName="d"
                  dur="8s"
                  repeatCount="indefinite"
                  values="
                    M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,154.7C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                    M0,96L48,112C96,128,192,160,288,170.7C384,181,480,171,576,154.7C672,139,768,117,864,122.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                    M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,154.7C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
              </path>
            </svg>
          </div>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="font-semibold tabular-nums text-2xl @[250px]/card:text-2xl">
              Thông báo
            </CardTitle>
            <CardAction>
              <Button variant="link" className="text-sm">
                Xem tất cả <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="line-clamp-3">
            Nội dung thông báo sẽ hiển thị ở đây.
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div>
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
              })}
            </div>
            <Badge>Đã đọc</Badge>
          </CardFooter>
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
          {mockClasses.map((classItem) => (
            <CarouselItem
              key={classItem.id}
              className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{classItem.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-xs">{classItem.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">{classItem.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">Phòng {classItem.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={classItem.progress} />
                    <span className="font-medium text-xs">
                      {classItem.progress}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Guide and calendar */}
      <div className="gap-4 grid md:grid-cols-4">
        {/* Quick Guide */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="font-semibold text-xl">
              Hướng dẫn nhanh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex-col space-y-4">
              <div className="bg-gradient-to-br from-blue-50 dark:from-blue-950 to-blue-100 dark:to-blue-900 p-4 rounded-lg">
                <div className="flex justify-center items-center bg-primary mx-auto mb-3 rounded-full w-12 h-12 font-bold text-white text-2xl">
                  1
                </div>
                <h4 className="mb-2 font-semibold text-sm text-center">
                  Điểm danh khuôn mặt
                </h4>
                <p className="text-muted-foreground text-xs text-center leading-relaxed">
                  Sử dụng công nghệ nhận diện khuôn mặt để điểm danh nhanh chóng
                  và chính xác
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 dark:from-blue-950 to-blue-100 dark:to-blue-900 p-4 rounded-lg">
                <div className="flex justify-center items-center bg-primary mx-auto mb-3 rounded-full w-12 h-12 font-bold text-white text-2xl">
                  2
                </div>
                <h4 className="mb-2 font-semibold text-sm text-center">
                  Quản lý lớp học
                </h4>
                <p className="text-muted-foreground text-xs text-center leading-relaxed">
                  Theo dõi lịch học, bài tập và thông tin lớp học một cách dễ
                  dàng
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 dark:from-blue-950 to-blue-100 dark:to-blue-900 p-4 rounded-lg">
                <div className="flex justify-center items-center bg-primary mx-auto mb-3 rounded-full w-12 h-12 font-bold text-white text-2xl">
                  3
                </div>
                <h4 className="mb-2 font-semibold text-sm text-center">
                  Nhận thông báo
                </h4>
                <p className="text-muted-foreground text-xs text-center leading-relaxed">
                  Nhận thông báo thời gian thực từ giảng viên và nhà trường
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold text-xl">Lịch học</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border rounded-lg [--cell-size:--spacing(10)] md:[--cell-size:--spacing(11)]"
            />
          </CardContent>
          <CardFooter className="flex-col gap-2">
            {date && (
              <div className="text-muted-foreground text-sm text-center">
                Ngày đã chọn: {date.toLocaleDateString("vi-VN")}
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
