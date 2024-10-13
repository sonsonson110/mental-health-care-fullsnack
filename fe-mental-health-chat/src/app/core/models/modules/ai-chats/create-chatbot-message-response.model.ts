export interface CreateChatbotMessageResponse {
    id: string;
    conversationId: string;
    content: string;
    createdAt: Date;
    isRead: boolean;
    lastUserMessageId: string;
    lastUserMessageCreatedAt: Date;
}