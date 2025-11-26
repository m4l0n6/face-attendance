export interface Classes {
  id: string
  name: string
  code: string
  description: string
  lecturerId: string
  _count: ClassesCount
  createdAt: string
}

type ClassesCount = {
    students: number;
    sessions: number;
}

export interface StudentInfo {
  studentId: string;
  name: string;
  email: string;
}

export interface Statistics {
  totalSessions: number;
  attendedSessions: number;
  absentSessions: number;
  attendanceRate: number;
}

export interface SessionAttendance {
  sessionId: string;
  sessionName: string;
  sessionDate: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  attended: boolean;
  attendanceTime: string | null;
}

export interface StudentStatisticsResponse {
  student: StudentInfo;
  statistics: Statistics;
  sessions: SessionAttendance[];
}