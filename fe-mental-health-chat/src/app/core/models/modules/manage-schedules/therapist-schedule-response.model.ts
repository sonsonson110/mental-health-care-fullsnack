export interface PrivateSessionScheduleResponse {
  id: string;
  privateSessionRegistrationId: string;
  client?: ScheduledClient;
  date: string;  // YYYY-MM-DD format
  startTime: string;  // HH:mm:ss format
  endTime: string;  // HH:mm:ss format
  noteFromTherapist: string | null;
  createdAt: Date;  // ISO 8601 datetime format
  updatedAt: Date;  // ISO 8601 datetime format
  isCancelled: boolean;
}

interface ScheduledClient {
  id: string;
  fullName: string;
  email: string;
  avatarName: string | null;
}
