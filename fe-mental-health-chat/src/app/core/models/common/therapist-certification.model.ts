export interface TherapistCertification {
  id?: string;
  name: string;
  issuingOrganization: string;
  dateIssued: string;
  expirationDate: string | null;
  referenceUrl: string | null;
}
