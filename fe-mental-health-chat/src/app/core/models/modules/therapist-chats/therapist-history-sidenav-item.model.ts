export interface TherapistHistorySidenavItem {
  id: string;
  therapistId: string;
  therapistFullName: string;
  isTherapistOnline: boolean;
  lastMessage: LastMessage;
}

export interface LastMessage {
  id: string;
  senderId: string;
  senderFullName: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}
