export interface CreateExperienceRequest {
    organization: string;
    position: string;
    description: string | null;
    startDate: string;
    endDate: string | null;
}