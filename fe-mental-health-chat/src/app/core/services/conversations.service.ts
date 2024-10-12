import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/dev.environment';
import { ChatbotHistorySideNavItem } from '../models/modules/ai-chat/chatbot-history-side-nav-item.model';
import { ChatbotConversationDetailResponse } from '../models/modules/ai-chat/chatbot-conversation-detail-response';
import { CreateChatbotConversationRequest } from '../models/modules/ai-chat/create-chatbot-conversation-request.model';
import { CreateChatbotConversationResponse } from '../models/modules/ai-chat/create-chatbot-conversation-response.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {
  private readonly baseUrl = environment.apiBaseUrl + '/conversations';

  constructor(private http: HttpClient) { }

  getChatbotConversationsByUserIdAsync() {
    return this.http.get<ChatbotHistorySideNavItem[]>(`${this.baseUrl}/chatbot`);
  }

  getChatbotConversationDetailById(conversationId: string) {
    return this.http.get<ChatbotConversationDetailResponse>(`${this.baseUrl}/chatbot/${conversationId}`);
  }

  createChatbotConversation(content: string) {
    const requestBody: CreateChatbotConversationRequest = { content };
    return this.http.post<CreateChatbotConversationResponse>(`${this.baseUrl}/chatbot`, requestBody);
  }
}
