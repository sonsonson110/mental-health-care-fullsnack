export interface Experience {
    id: string;
    organization: string;
    position: string;
    description: string | null;
    startDate: Date;
    endDate: Date | null;
}