import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DomSanitizer } from '@angular/platform-browser';
import { SidenavStateService } from '../../services/sidenav-state.service';
import { BehaviorSubject, finalize, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../../../core/services/auth.service';
import { ConversationsService } from '../../../../core/services/conversations.service';
import {
  ChatbotConversationDetailResponse,
  ChatbotConversationMessageResponse,
} from '../../../../core/models/modules/ai-chat/chatbot-conversation-detail-response';
import { ChatbotMessageDisplay } from '../../../../core/models/modules/ai-chat/chatbot-message-display.model';
import { MessagesService } from '../../../../core/services/messages.service';
import { CreateChatbotMessageResponse } from '../../../../core/models/modules/ai-chat/create-chatbot-message-response.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateChatbotConversationResponse } from '../../../../core/models/modules/ai-chat/create-chatbot-conversation-response.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-ai-chat-conversation',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
    CommonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MarkdownModule,
  ],
  templateUrl: './ai-chat-conversation.component.html',
  styleUrl: './ai-chat-conversation.component.scss',
})
export class AiChatConversationComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer')
  private messagesContainer!: ElementRef;

  private sidenavStateSubscription!: Subscription;
  isSmOrLargerScreen = false;
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
    private sideNavService: SidenavStateService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private breakpointObserver: BreakpointObserver,
    private sidenavStateService: SidenavStateService,
    private route: ActivatedRoute,
    private conversationsService: ConversationsService,
    private messagesService: MessagesService
  ) {
    const jwtTokenPayload = this.authService.decodeToken();
    this.sessionUserId =
      jwtTokenPayload?.[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];
    this.sessionUserFullName =
      jwtTokenPayload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    this.matIconRegistry.addSvgIcon(
      'side_navigation',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/side-navigation.svg')
    );
    this.breakpointObserver.observe('(min-width: 490px)').subscribe(result => {
      // should open sidenav when screen is 490px or larger and vice versa
      this.sidenavStateService.emitStateEvent(result.matches);
    });
  }

  ngOnInit(): void {
    this.isSideNavOpen = this.sidenavStateService.getState();
    this.sidenavStateSubscription = this.sidenavStateService.sidenavState$.subscribe(
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

  ngOnDestroy(): void {
    this.sidenavStateSubscription.unsubscribe();
  }

  private mapToChatbotMessageDisplay(
    response: ChatbotConversationMessageResponse,
    senderFullName: string | null = null
  ): ChatbotMessageDisplay {
    return {
      id: response.id,
      senderId: response.senderId || '',
      senderFullName: senderFullName,
      content: response.content,
      createdAt: response.createdAt,
      isRead: response.isRead,
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

    // if this is an existed conversation
    if (this.conversationId) {
      const userMessage: ChatbotMessageDisplay = {
        id: crypto.randomUUID(), // just a placeholder for now, will be replaced with actual id from response
        senderFullName: this.sessionUserFullName,
        senderId: this.sessionUserId,
        content: this.userTypingMessage.value!,
        createdAt: new Date(),
        isRead: true,
        isSending: true,
      };
      this.messagesSubject.next([...this.messagesSubject.value, userMessage]);
      this.isSending = true;
      this.scrollToBottom();

      this.messagesService
        .createChatbotMessage(this.conversationId!, this.userTypingMessage.value!)
        .pipe(
          finalize(() => {
            this.isSending = false;
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
            };
            const currentMessages = this.messagesSubject.value;
            let lastUserSendingMessage = currentMessages.pop();
            // adjust for successfull response
            lastUserSendingMessage!.isSending = false;
            lastUserSendingMessage!.id = response.lastUserMessageId;

            this.messagesSubject.next([
              ...currentMessages,
              lastUserSendingMessage!,
              chatbotMessageToDisplay,
            ]);

            this.userTypingMessage.reset();
          },
          error: err => {
            const currentMessages = this.messagesSubject.value;
            let lastUserSendingMessage = currentMessages.pop();
            lastUserSendingMessage!.isError = true;
            this.messagesSubject.next([...currentMessages, lastUserSendingMessage!]);
            // add notifcation to user later
          },
        });
    }
    // when message is sent from the conversation creation page
    else {
      this.conversationsService
        .createChatbotConversation(this.userTypingMessage.value!)
        .pipe(
          finalize(() => {
            this.isSending = false;
          })
        )
        .subscribe({
          next: (response: CreateChatbotConversationResponse) => {
            this.isLoading = true;
            this.sideNavService.addAiChatHistory({
              id: response.conversationId,
              title: response.title,
            });
            this.router.navigate(['ai-chat', response.conversationId]);
          },
          error: err => {
            // add notifcation to user later
          },
        });
    }
  }
}
