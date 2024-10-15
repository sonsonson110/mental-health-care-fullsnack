export interface ChatbotMessageDisplay {
    id: string;
    senderId?: string;
    content: string;
    createdAt: Date;
    isRead: boolean;
    isSending?: boolean;
    isError?: boolean;
}