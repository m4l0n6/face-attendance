export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
  studentInfo: StudentInfo[];
}

export interface StudentClass {
  id: string;
  name: string;
  code: string;
}

export interface StudentInfo {
  id: string;
  studentId: string;
  name: string;
  email: string;
  class: StudentClass;
}
