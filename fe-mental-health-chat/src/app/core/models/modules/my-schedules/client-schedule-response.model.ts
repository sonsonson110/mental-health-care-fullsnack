export interface ClientScheduleResponse {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  noteFromTherapist?: string | null;
  createdAt: string;
  updatedAt: string;
  isCancelled: boolean;
}
