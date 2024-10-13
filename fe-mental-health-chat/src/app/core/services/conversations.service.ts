import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/dev.environment';
import { ChatbotHistorySideNavItem } from '../models/modules/ai-chats/chatbot-history-side-nav-item.model';
import { ChatbotConversationDetailResponse } from '../models/modules/ai-chats/chatbot-conversation-detail-response';
import { CreateChatbotConversationRequest } from '../models/modules/ai-chats/create-chatbot-conversation-request.model';
import { CreateChatbotConversationResponse } from '../models/modules/ai-chats/create-chatbot-conversation-response.model';
import { TherapistHistorySidenavItem } from '../models/modules/therapist-chats/therapist-history-sidenav-item.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {
  private readonly baseUrl = environment.apiBaseUrl + '/conversations';

  constructor(private http: HttpClient) { }

  getChatbotConversations() {
    return this.http.get<ChatbotHistorySideNavItem[]>(`${this.baseUrl}/chatbot`);
  }

  getChatbotConversationDetailById(conversationId: string) {
    return this.http.get<ChatbotConversationDetailResponse>(`${this.baseUrl}/chatbot/${conversationId}`);
  }

  createChatbotConversation(content: string) {
    const requestBody: CreateChatbotConversationRequest = { content };
    return this.http.post<CreateChatbotConversationResponse>(`${this.baseUrl}/chatbot`, requestBody);
  }

  getTherapistConversations() {
    return this.http.get<TherapistHistorySidenavItem[]>(`${this.baseUrl}/therapist`);
  }
}
