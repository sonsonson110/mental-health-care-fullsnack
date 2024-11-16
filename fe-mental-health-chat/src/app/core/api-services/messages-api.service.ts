import { Injectable } from '@angular/core';
import { environment } from '../../../environment/dev.environment';
import { HttpClient } from '@angular/common/http';
import { CreateChatbotMessageRequest } from '../models/modules/ai-chats/create-chatbot-message-request.model';
import { CreateChatbotMessageResponse } from '../models/modules/ai-chats/create-chatbot-message-response.model';

@Injectable({
  providedIn: 'root'
})
export class MessagesApiService {
  private readonly baseUrl = environment.apiBaseUrl + '/messages';

  constructor(private http: HttpClient) { }

  createChatbotMessage(conversationId: string, content: string) {
    const requestBody: CreateChatbotMessageRequest = {
      conversationId,
      content
    };
    return this.http.post<CreateChatbotMessageResponse>(`${this.baseUrl}/chatbot`, requestBody);
  }
}
