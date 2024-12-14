import { IssueTag } from '../../common/issue-tag.model';

export interface CreateChatbotMessageResponse {
    id: string;
    conversationId: string;
    content: string;
    createdAt: Date;
    isRead: boolean;
    issueTags: IssueTag[];
    lastUserMessageId: string;
    lastUserMessageCreatedAt: Date;
}
