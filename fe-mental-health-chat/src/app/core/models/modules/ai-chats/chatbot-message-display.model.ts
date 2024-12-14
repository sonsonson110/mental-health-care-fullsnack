import { IssueTag } from '../../common/issue-tag.model';

export interface ChatbotMessageDisplay {
    id: string;
    senderId?: string;
    content: string;
    createdAt: Date;
    isRead: boolean;
    isSending?: boolean;
    isError?: boolean;
    issueTags: IssueTag[];
}
