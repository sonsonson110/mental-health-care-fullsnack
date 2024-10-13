export interface ChatbotConversationDetailResponse {
    id: string;
    title: string;
    messages: ChatbotConversationMessageResponse[];
}

export interface ChatbotConversationMessageResponse {
    id: string;
    senderId: string | null;
    content: string;
    createdAt: Date;
    updatedAt: Date | null;
    isRead: boolean;
}