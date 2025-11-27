export interface Session {
  id: string;
  classId: string;
  className: string;
  classCode: string;
  leturerName: string;
  scheduleSessionId: string;
  scheduleSession: scheduleSession;
  startAt: string
  endAt: string;
  isActive: boolean;
  totalAttendances: number;
  createdBy: string;
  createdAt: string;
}

export interface scheduleSession {
    id: string;
    sessionName: string;
    sessionDate: string;
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}
