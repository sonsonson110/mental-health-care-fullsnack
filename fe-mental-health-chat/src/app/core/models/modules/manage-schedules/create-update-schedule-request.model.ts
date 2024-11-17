export interface CreateUpdateScheduleRequest {
  id?: string | null;
  privateSessionRegistrationId?: string;
  date: string;
  startTime: string;
  endTime?: string;
  noteFromTherapist?: string | null;
  isCancelled?: boolean;
}
