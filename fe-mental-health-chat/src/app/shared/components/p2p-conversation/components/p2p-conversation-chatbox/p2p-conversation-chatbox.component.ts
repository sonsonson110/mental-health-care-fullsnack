import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { AuthApiService } from '../../../../../core/api-services/auth-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BreakpointObserver } from '@angular/cdk/layout';
import { P2pConversationMessageDisplay } from '../../../../../core/models/p2p-conversation-mesage-display.model';
import { P2pMessageRequest } from '../../../../../core/models/p2p-message-request.model';
import { P2pConversationStateService } from '../../services/p2p-conversation-state.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-p2p-conversation-chatbox',
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
    MatProgressBarModule,
  ],
  templateUrl: './p2p-conversation-chatbox.component.html',
  styleUrl: './p2p-conversation-chatbox.component.scss',
})
export class P2pConversationChatboxComponent implements OnInit {
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
  conversationType: 'therapist-chats' | 'client-chats' | null = null;
  receiverId: string | null = null;
  messages$: Observable<P2pConversationMessageDisplay[]>;
  userTypingMessage = new FormControl(
    { value: '', disabled: false },
    Validators.required
  );

  constructor(
    private p2pConversationStateService: P2pConversationStateService,
    authService: AuthApiService,
    private cdr: ChangeDetectorRef,
    private matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute
  ) {
    this.sessionUserId = authService.getSessionUserId();
    this.sessionUserFullName = authService.getSessionUserName();

    this.matIconRegistry.addSvgIcon(
      'side_navigation',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/side-navigation.svg')
    );
    this.breakpointObserver.observe('(min-width: 490px)').subscribe(result => {
      // should open sidenav when screen is 490px or larger and vice versa
      this.p2pConversationStateService.setSidenavOpenState(result.matches);
    });

    this.p2pConversationStateService.chatboxLoadingState$.subscribe(
      state => (this.isLoading = state)
    );
    this.messages$ = this.p2pConversationStateService.messages$;
  }

  ngOnInit(): void {
    this.p2pConversationStateService.sidenavOpenState$.subscribe(state => {
      this.isSideNavOpen = state;
    });

    this.route.data.subscribe(data => {
      this.conversationType = data['forModule'];
    });

    this.route.paramMap.subscribe(params => {
      const conversationId = params.get('id');

      if (conversationId) {
        this.conversationId = conversationId;
        this.userTypingMessage.disable();

        this.p2pConversationStateService
          .loadMessages(conversationId, this.conversationType!)
          .subscribe(response => {
            this.conversationTitle = response.receiverFullName;
            this.receiverId = response.receiverId;
            this.scrollToBottom();
            this.userTypingMessage.enable();
          });

        this.p2pConversationStateService.initChatboxConnection(
          conversationId,
          this.sessionUserId!
        );
      }
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
    this.p2pConversationStateService.toggleSidenavOpenState();
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
    this.p2pConversationStateService.addMessage(currentMessage);
    this.scrollToBottom();

    const p2pMessageRequest: P2pMessageRequest = {
      conversationId: this.conversationId!,
      content: this.userTypingMessage.value!,
      sentToUserId: this.receiverId!,
    };

    this.p2pConversationStateService.sendMessage(p2pMessageRequest).subscribe(() => {
      this.isSending = false;
      this.userTypingMessage.reset();
      this.userTypingMessage.enable();
    });
  }
}
