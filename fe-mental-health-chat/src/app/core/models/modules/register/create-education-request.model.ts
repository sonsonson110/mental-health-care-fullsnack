export interface CreateEducationRequest {
    institution: string;
    degree: string | null;
    major: string | null;
    startDate: string;
    endDate: string | null;
}