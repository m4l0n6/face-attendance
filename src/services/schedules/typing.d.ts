export interface Schedule {
    id: string;
    sessionName: string;
    startDateTime: string;
    endDateTime: string;
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
    note: string;
    class: Class;
    lecturerName: string;
    schedule: Schedule;
    attendanceSession: AttendanceSession
    createdAt: string;
    updatedAt: string;
}

export interface Class {
    id: string;
    name: string;
    code: string;
}

export interface Schedule {
    id: string;
    name: string;
    room: string;
    description: string;
}

export interface AttendanceSession {
    id: string;
    actualStartAt: string;
    actualEndAt: string;
    attendanceCount: number;
}