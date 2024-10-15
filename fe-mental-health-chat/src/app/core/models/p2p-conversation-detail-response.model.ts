export interface P2pConversationDetailResponseDto {
  id: string;
  receiverId: string;
  receiverFullName: string;
  messages: P2pMessageDto[];
}
export interface P2pMessageDto {
  id: string;
  senderId: string;
  senderFullName: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
  isRead: boolean;
}
