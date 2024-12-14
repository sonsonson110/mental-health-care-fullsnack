import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DomSanitizer } from '@angular/platform-browser';
import { SidenavStateService } from '../../services/sidenav-state.service';
import { BehaviorSubject, finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthApiService } from '../../../../core/api-services/auth-api.service';
import { ConversationsApiService } from '../../../../core/api-services/conversations-api.service';
import {
  ChatbotConversationDetailResponse,
  ChatbotConversationMessageResponse,
} from '../../../../core/models/modules/ai-chats/chatbot-conversation-detail-response';
import { ChatbotMessageDisplay } from '../../../../core/models/modules/ai-chats/chatbot-message-display.model';
import { MessagesApiService } from '../../../../core/api-services/messages-api.service';
import { CreateChatbotMessageResponse } from '../../../../core/models/modules/ai-chats/create-chatbot-message-response.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateChatbotConversationResponse } from '../../../../core/models/modules/ai-chats/create-chatbot-conversation-response.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MarkdownModule } from 'ngx-markdown';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IssueTag } from '../../../../core/models/common/issue-tag.model';

@Component({
  selector: 'app-ai-chat-conversation',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MarkdownModule,
    MatProgressBarModule
  ],
  templateUrl: './ai-chats-conversation.component.html',
  styleUrl: './ai-chats-conversation.component.scss',
})
export class AiChatsConversationComponent implements OnInit {
  @ViewChild('messagesContainer')
  private messagesContainer!: ElementRef;

  isSideNavOpen = true;

  // component metadata
  sessionUserId;
  sessionUserFullName;
  isLoading = false;
  isSending = false;
  conversationId: string | null = null;
  conversationTitle = '';
  userTypingMessage = new FormControl(
    { value: '', disabled: false },
    Validators.required
  );
  private messagesSubject = new BehaviorSubject<ChatbotMessageDisplay[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor(
    private router: Router,
    authService: AuthApiService,
    private cdr: ChangeDetectorRef,
    private matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private breakpointObserver: BreakpointObserver,
    private sidenavStateService: SidenavStateService,
    private route: ActivatedRoute,
    private conversationsService: ConversationsApiService,
    private messagesService: MessagesApiService
  ) {
    this.sessionUserId = authService.getSessionUserId();
    this.sessionUserFullName = authService.getSessionUserName();
    this.matIconRegistry.addSvgIcon(
      'side_navigation',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/side-navigation.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'gemini_icon',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/google-gemini-icon.svg')
    );
    this.breakpointObserver.observe('(min-width: 490px)').subscribe(result => {
      // should open sidenav when screen is 490px or larger and vice versa
      this.sidenavStateService.emitStateEvent(result.matches);
    });
  }

  ngOnInit(): void {
    this.isSideNavOpen = this.sidenavStateService.getState();
    this.sidenavStateService.sidenavState$.subscribe(
      state => {
        this.isSideNavOpen = state;
      }
    );
    this.route.paramMap.subscribe(params => {
      const conversationId = params.get('id');

      if (conversationId) {
        this.conversationId = conversationId;
        this.isLoading = true;
        this.userTypingMessage.disable();
        this.loadConversationDetail(conversationId);
      }
    });
  }

  private mapToChatbotMessageDisplay(
    response: ChatbotConversationMessageResponse,
  ): ChatbotMessageDisplay {
    return {
      id: response.id,
      senderId: response.senderId || '',
      content: response.content,
      createdAt: response.createdAt,
      isRead: response.isRead,
      issueTags: response.issueTags ?? [],
    };
  }

  private loadConversationDetail(conversationId: string): void {
    this.conversationsService
      .getChatbotConversationDetailById(conversationId)
      .subscribe((data: ChatbotConversationDetailResponse) => {
        this.conversationTitle = data.title;
        this.messagesSubject.next(
          data.messages.map(message => this.mapToChatbotMessageDisplay(message))
        );
        this.isLoading = false;
        this.userTypingMessage.enable();
        // data may not be rendered yet, so wait a bit before scrolling to bottom
        this.scrollToBottom()
      });
  }

  private scrollToBottom(): void {
    const waitTimeInMillis = 30;
    setTimeout(() => {
      try {
        this.cdr.detectChanges();
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Could not scroll to bottom:', err);
      }
    }, waitTimeInMillis);
  }

  onSidenavClick() {
    this.sidenavStateService.toggleState();
  }

  canSendMessage = () =>
    this.userTypingMessage.valid && !this.isSending && !this.isLoading;
  // add user typing message with sending state to the list of messages then call message service to send the message
  // when response is received, update user typing message state and add the response from chatbot
  onSendMessageClick() {
    this.isSending = true;
    this.userTypingMessage.disable();

    // if this is an existed conversation
    if (this.conversationId) {
      const userMessage: ChatbotMessageDisplay = {
        id: crypto.randomUUID(), // just a placeholder for now, will be replaced with actual id from response
        senderId: this.sessionUserId,
        content: this.userTypingMessage.value!,
        createdAt: new Date(),
        isRead: true,
        isSending: true,
        issueTags: [],
      };
      this.messagesSubject.next([...this.messagesSubject.value, userMessage]);
      this.isSending = true;
      this.scrollToBottom();

      this.messagesService
        .createChatbotMessage(this.conversationId!, this.userTypingMessage.value!)
        .pipe(
          finalize(() => {
            this.isSending = false;
            this.userTypingMessage.enable();
            this.scrollToBottom();
          })
        )
        .subscribe({
          next: (response: CreateChatbotMessageResponse) => {
            const chatbotMessageToDisplay: ChatbotMessageDisplay = {
              id: response.id,
              content: response.content,
              createdAt: response.createdAt,
              isRead: response.isRead,
              issueTags: response.issueTags ?? [],
            };
            const currentMessages = this.messagesSubject.value;
            const lastUserSendingMessage = currentMessages.pop();
            // adjust for successful response
            lastUserSendingMessage!.isSending = false;
            lastUserSendingMessage!.id = response.lastUserMessageId;
            lastUserSendingMessage!.createdAt = response.lastUserMessageCreatedAt;

            this.messagesSubject.next([
              ...currentMessages,
              lastUserSendingMessage!,
              chatbotMessageToDisplay,
            ]);

            this.userTypingMessage.reset();
          },
          error: () => {
            const currentMessages = this.messagesSubject.value;
            const lastUserSendingMessage = currentMessages.pop();
            lastUserSendingMessage!.isError = true;
            this.messagesSubject.next([...currentMessages, lastUserSendingMessage!]);
          },
        });
    }
    // when message is sent from the conversation creation page
    else {
      this.isLoading = true;
      this.conversationsService
        .createChatbotConversation(this.userTypingMessage.value!)
        .pipe(
          finalize(() => {
            this.isSending = false;
            this.userTypingMessage.enable();
          })
        )
        .subscribe({
          next: (response: CreateChatbotConversationResponse) => {
            this.isLoading = true;
            this.sidenavStateService.addAiChatHistory({
              id: response.conversationId,
              title: response.title,
            });
            this.router.navigate(['ai-chats', response.conversationId]);
          }
        });
    }
  }

  navigateToTherapist(issueTag: IssueTag[]) {
    const ids = issueTag.map(tag => tag.id);
    this.router.navigate(['/therapists'], { queryParams: { issueTagIds: ids }, queryParamsHandling: 'merge' });
  }

  navigateToPublicSession(issueTag: IssueTag[]) {
    const ids = issueTag.map(tag => tag.id);
    this.router.navigate(['/public-sessions'], { queryParams: { issueTagIds: ids }, queryParamsHandling: 'merge' });
  }
}
