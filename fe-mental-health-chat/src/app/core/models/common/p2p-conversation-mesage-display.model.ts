export interface P2pConversationMessageDisplay {
    id: string;
    senderId: string;
    senderFullName: string;
    content: string;
    createdAt: Date;
    isRead: boolean;
    updatedAt?: Date | null;
    isSending?: boolean;
    isError?: boolean;
    conversationId?: string | null;
}