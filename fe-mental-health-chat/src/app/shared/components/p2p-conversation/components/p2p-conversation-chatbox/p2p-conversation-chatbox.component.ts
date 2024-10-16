import { DatePipe, CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MarkdownModule } from 'ngx-markdown';
import { P2pConversationSidenavStateService } from '../../services/p2p-conversation-sidenav-state.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject, finalize } from 'rxjs';
import { ConversationsService } from '../../../../../core/services/conversations.service';
import { P2pConversationMessageDisplay } from '../../../../../core/models/p2p-conversation-mesage-display.model';
import { P2pMessageDto } from '../../../../../core/models/p2p-conversation-detail-response.model';
import { SignalrChatService } from '../../../../../core/services/signalr-chat.service';
import { P2pMessageRequest } from '../../../../../core/models/p2p-message-request.model';
import { P2pConversationMessageDisplayService } from '../../services/p2p-conversation-message-display.service';

@Component({
  selector: 'app-p2p-conversation-chatbox',
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
    MatProgressBarModule,
  ],
  providers: [P2pConversationMessageDisplayService],
  templateUrl: './p2p-conversation-chatbox.component.html',
  styleUrl: './p2p-conversation-chatbox.component.scss',
})
export class P2pConversationChatboxComponent {
  @ViewChild('messagesContainer')
  private messagesContainer!: ElementRef;

  isSmOrLargerScreen = false;
  isSideNavOpen = true;

  // component metadata
  sessionUserId;
  sessionUserFullName;
  isLoading = false;
  isSending = false;
  conversationId: string | null = null;
  conversationTitle = '';
  receiverId: string | null = null;
  userTypingMessage = new FormControl(
    { value: '', disabled: false },
    Validators.required
  );

  constructor(
    private p2pConversationSidenavStateService: P2pConversationSidenavStateService,
    public p2pConversationMessageDisplayService: P2pConversationMessageDisplayService,
    authService: AuthService,
    private cdr: ChangeDetectorRef,
    private matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private conversationsService: ConversationsService,
    private signalRChatService: SignalrChatService
  ) {
    this.sessionUserId = authService.getSessionUserId();
    this.sessionUserFullName = authService.getSessionUserName();
    this.matIconRegistry.addSvgIcon(
      'side_navigation',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/side-navigation.svg')
    );
    this.breakpointObserver.observe('(min-width: 490px)').subscribe(result => {
      // should open sidenav when screen is 490px or larger and vice versa
      this.p2pConversationSidenavStateService.emitStateEvent(result.matches);
    });
  }

  ngOnInit(): void {
    this.isSideNavOpen = this.p2pConversationSidenavStateService.getState();
    this.p2pConversationSidenavStateService.sidenavState$.subscribe(state => {
      this.isSideNavOpen = state;
    });
    this.route.paramMap.subscribe(params => {
      const conversationId = params.get('id');

      if (conversationId) {
        this.conversationId = conversationId;
        this.isLoading = true;
        this.userTypingMessage.disable();
        this.loadConversationDetail(conversationId);
        this.conversationTitle = conversationId;
      }
    });

    // signalr observation
    this.signalRChatService
      .receiveP2PMessage()
      .subscribe((message: P2pConversationMessageDisplay) => {
        if (message.conversationId !== this.conversationId) return;

        if (message.senderId !== this.sessionUserId) {
          this.p2pConversationMessageDisplayService.addMessage(message);
        } else {
          this.p2pConversationMessageDisplayService.markSendingMessageSent(message);
        }
        this.scrollToBottom(); // may be show a notification instead of scrolling to bottom
      });

    this.signalRChatService.onException().subscribe(error => {
      this.isSending = false;
      this.userTypingMessage.enable();
      this.p2pConversationMessageDisplayService.markLastSendingMessageAsError();
    });
  }

  private loadConversationDetail(conversationId: string): void {
    this.conversationsService
      .getTherapistConversationDetailById(conversationId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.userTypingMessage.enable();
        })
      )
      .subscribe({
        next: response => {
          this.conversationTitle = response.receiverFullName;
          this.receiverId = response.receiverId;
          this.p2pConversationMessageDisplayService.initializeMessages(
            response.messages.map(this.mapToP2pMessageDisplay)
          );
          this.scrollToBottom();
        },
        error: err => {
          // TODO: handle error
        },
      });
  }

  private mapToP2pMessageDisplay(dto: P2pMessageDto): P2pConversationMessageDisplay {
    return {
      id: dto.id,
      senderId: dto.senderId,
      senderFullName: dto.senderFullName,
      content: dto.content,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      isRead: dto.isRead,
    };
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
    this.p2pConversationSidenavStateService.toggleState();
  }

  canSendMessage = () =>
    this.userTypingMessage.valid && !this.isSending && !this.isLoading;
  // add user typing message with sending state to the list of messages then call message service to send the message
  // when response is received, update user typing message state and add the response from chatbot
  onSendMessageClick() {
    this.isSending = true;
    this.userTypingMessage.disable();

    // add a temporary message to the list of messages
    const currentMessage: P2pConversationMessageDisplay = {
      id: crypto.randomUUID(),
      senderId: this.sessionUserId!,
      senderFullName: this.sessionUserFullName!,
      content: this.userTypingMessage.value!,
      createdAt: new Date(),
      isRead: false,
      isSending: true,
    };
    this.p2pConversationMessageDisplayService.addMessage(currentMessage);
    this.scrollToBottom();

    var p2pMessageRequest: P2pMessageRequest = {
      conversationId: this.conversationId!,
      content: this.userTypingMessage.value!,
      sentToUserId: this.receiverId!,
    };

    this.signalRChatService.sendP2PMessage(p2pMessageRequest).subscribe(() => {
      this.isSending = false;
      this.userTypingMessage.reset();
      this.userTypingMessage.enable();
    });
  }
}
