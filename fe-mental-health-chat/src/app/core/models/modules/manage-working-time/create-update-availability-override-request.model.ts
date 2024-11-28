export interface CreateUpdateAvailabilityOverrideRequest {
  id?: string | null;
  date: string | null; // DateOnly, formatted as "YYYY-MM-DD"
  startTime: string | null; // TimeOnly, formatted as "HH:mm:ss"
  endTime?: string | null; // TimeOnly, formatted as "HH:mm:ss"
  isAvailable?: boolean | null;
  description?: string | null;
}
