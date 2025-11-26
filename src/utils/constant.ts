
const APP_NAME = import.meta.env.VITE_APP_NAME
const APP_CONFIG_API_URL = import.meta.env.VITE_APP_CONFIG_API_URL

interface ClassData {
  id: number;
  name: string;
  teacher: string;
  schedule: string;
  room: string;
  progress: number;
}

export const mockClasses: ClassData[] = [
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


export { APP_NAME, APP_CONFIG_API_URL };