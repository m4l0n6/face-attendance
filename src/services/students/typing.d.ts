export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  classId: string;
  class: Class;
  faceImage?: FaceImage | null;
  faceDescriptorsCount?: number;
  hasFaceDescriptor?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetStudentsResponse {
  data: Student[];
  pagination: PaginationMeta;
}

export interface GetStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

