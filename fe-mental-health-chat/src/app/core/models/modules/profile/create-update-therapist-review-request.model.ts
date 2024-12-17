export interface CreateUpdateTherapistReviewRequest {
  id?: string | null;
  therapistId: string;
  rating: number;
  comment: string;
}
