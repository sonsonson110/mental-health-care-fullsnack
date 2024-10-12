export interface CreateCertificationRequest {
    name: string;
    issuingOrganization: string;
    dateIssued: string;
    expirationDate: string | null;
    referenceUrl: string | null;
}