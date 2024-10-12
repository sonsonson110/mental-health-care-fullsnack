export interface ChatbotMessageDisplay {
    id: string;
    senderId?: string;
    senderFullName?: string | null;
    content: string;
    createdAt: Date;
    isRead: boolean;
    isSending?: boolean;
    isError?: boolean;
}