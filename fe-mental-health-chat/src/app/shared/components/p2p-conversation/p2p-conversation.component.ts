import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { P2pConversationSidenavStateService } from './services/p2p-conversation-sidenav-state.service';
import { P2pConversationSidenavItem } from '../../../core/models/p2p-conversation-sidenav-item.model';
import { Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthApiService } from '../../../core/api-services/auth-api.service';
import { ConversationsApiService } from '../../../core/api-services/conversations-api.service';
import { SignalrChatService } from '../../../core/api-services/signalr-chat.service';

@Component({
  selector: 'app-p2p-conversation-chatbox',
  standalone: true,
  imports: [
    MatSidenavModule,
    RouterModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    CommonModule,
    MatButtonModule,
  ],
  providers: [P2pConversationSidenavStateService, SignalrChatService],
  templateUrl: './p2p-conversation.component.html',
  styleUrl: './p2p-conversation.component.scss',
})
export class P2pConversationComponent implements OnInit, OnDestroy {
  isSidenavLoading = false;
  currentBrowserUrl: string | null = null;
  isSidenavOpen!: boolean;
  sessionUserId: string | undefined;
  conversationType!: string;

  chatHistories$!: Observable<P2pConversationSidenavItem[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private p2pConversationSidenavStateService: P2pConversationSidenavStateService,
    private conversationsService: ConversationsApiService,
    location: Location,
    breakpointObserver: BreakpointObserver,
    authService: AuthApiService,
    private signalrChatService: SignalrChatService
  ) {
    matIconRegistry.addSvgIcon(
      'side_navigation',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/side-navigation.svg')
    );

    breakpointObserver.observe('(min-width: 490px)').subscribe(result => {
      // should open sidenav when screen is 490px or larger and vice versa
      this.p2pConversationSidenavStateService.emitStateEvent(result.matches);
    });

    this.currentBrowserUrl = location.path();
    // Listen for navigation changes to update the current chat box id
    location.onUrlChange(url => {
      this.currentBrowserUrl = url;
    });

    this.sessionUserId = authService.getSessionUserId();
  }
  ngOnDestroy(): void {
    this.signalrChatService
      .stopConnection()
      .then(() => console.log("Websocket '/chat' stopped for therapist-chats"));
  }

  ngOnInit(): void {
    this.chatHistories$ =
      this.p2pConversationSidenavStateService.p2pConversationSidenavItems$;
    this.isSidenavOpen = this.p2pConversationSidenavStateService.getState();

    this.p2pConversationSidenavStateService.sidenavState$.subscribe(state => {
      this.isSidenavOpen = state;
    });

    this.route.data.subscribe(data => {
      this.conversationType = data['forModule'];
      this.loadchatHistories();
    });

    this.signalrChatService.startConnection().then(() => {
      console.log("Websocket '/chat' started for therapist-chats");

      this.signalrChatService.receiveP2PMessage().subscribe(message => {
        var currentSidenavItem =
          this.p2pConversationSidenavStateService.getP2pConversationSidenavItemById(
            message.conversationId!
          );
        currentSidenavItem.lastMessage = {
          id: message.id,
          senderId: message.senderId,
          senderFullName: message.senderFullName,
          content: message.content,
          createdAt: message.createdAt,
          isRead: message.isRead,
        };
        this.p2pConversationSidenavStateService.updateP2pConversationSidenavItem(
          currentSidenavItem
        );
      });
    });
  }

  private loadchatHistories() {
    console.log('this.conversationType', this.conversationType);
    if (this.conversationType === 'therapist-chats') {
      this.conversationsService
        .getTherapistConversations()
        .subscribe((data: P2pConversationSidenavItem[]) => {
          this.p2pConversationSidenavStateService.initialP2pConversationSidenavItem(data);
          this.isSidenavLoading = false;
        });
    } else if (this.conversationType === 'client-chats') {
      this.conversationsService
        .getClientConversations()
        .subscribe((data: P2pConversationSidenavItem[]) => {
          this.p2pConversationSidenavStateService.initialP2pConversationSidenavItem(data);
          this.isSidenavLoading = false;
        });
    }
  }

  onNavItemClick(id: string) {
    if (this.conversationType === 'therapist-chats') {
      this.router.navigate(['therapist-chats', id]);
    } else if (this.conversationType === 'client-chats') {
      this.router.navigate(['client-chats', id]);
    }
  }

  onSidenavToggleClick() {
    this.p2pConversationSidenavStateService.toggleState();
  }

  isMatchCurrentBrowserUrl(route: string): boolean {
    const uriSegments = this.currentBrowserUrl?.split('/');
    return uriSegments ? uriSegments.includes(route) : false;
  }
}
