export interface RecordAttendanceRequest {
  sessionId: string;
  studentId: string;
  method: "face" | "manual";
  matchedAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  method: "face" | "manual";
  matchedAt: string;
}

