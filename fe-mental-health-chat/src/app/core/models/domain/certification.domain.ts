export interface Certification {
    id: string;
    name: string;
    issuingOrganization: string;
    dateIssued: Date;
    expirationDate: Date | null;
    referenceUrl: string | null;
}