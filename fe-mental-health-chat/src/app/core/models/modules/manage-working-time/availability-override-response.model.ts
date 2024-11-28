export interface AvailabilityOverrideResponse {
  id: string;
  date: string; // Corresponds to DateOnly, formatted as "YYYY-MM-DD"
  startTime: string; // Corresponds to TimeOnly, formatted as "HH:mm:ss"
  endTime: string; // Corresponds to TimeOnly, formatted as "HH:mm:ss"
  isAvailable: boolean;
  description?: string;
}
