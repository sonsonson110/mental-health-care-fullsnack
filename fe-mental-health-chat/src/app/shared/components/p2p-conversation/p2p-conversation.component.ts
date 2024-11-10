import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { P2pConversationSidenavItem } from '../../../core/models/p2p-conversation-sidenav-item.model';
import { Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthApiService } from '../../../core/api-services/auth-api.service';
import { SignalRChatService } from '../../../core/api-services/signal-r-chat.service';
import { P2pConversationStateService } from './services/p2p-conversation-state.service';

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
  providers: [SignalRChatService, P2pConversationStateService],
  templateUrl: './p2p-conversation.component.html',
  styleUrl: './p2p-conversation.component.scss',
})
export class P2pConversationComponent implements OnInit, OnDestroy {
  sessionUserId: string | undefined;

  isSidenavLoading$!: Observable<boolean>;
  isSidenavOpen!: boolean;
  chatHistories$: Observable<P2pConversationSidenavItem[]>;

  conversationType!: string;
  currentBrowserUrl: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private p2pConversationStateService: P2pConversationStateService,
    location: Location,
    breakpointObserver: BreakpointObserver,
    authService: AuthApiService
  ) {
    matIconRegistry.addSvgIcon(
      'side_navigation',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/side-navigation.svg')
    );

    breakpointObserver.observe('(min-width: 490px)').subscribe(result => {
      // should open sidenav when screen is 490px or larger and vice versa
      this.p2pConversationStateService.setSidenavOpenState(result.matches);
    });

    this.currentBrowserUrl = location.path();
    // Listen for navigation changes to update the current chat box id
    location.onUrlChange(url => {
      this.currentBrowserUrl = url;
    });

    this.sessionUserId = authService.getSessionUserId();

    this.isSidenavLoading$ = this.p2pConversationStateService.sidenavLoadingState$;
    this.chatHistories$ = this.p2pConversationStateService.p2pConversationSidenavItems$;
    this.p2pConversationStateService.sidenavOpenState$.subscribe(
      state => (this.isSidenavOpen = state)
    );
  }

  ngOnDestroy(): void {
    this.p2pConversationStateService
      .stopSignalrConnection()
      .then(() => console.log("Websocket '/chat' stopped for " + this.conversationType));
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.conversationType = data['forModule'];
      this.p2pConversationStateService.initialP2pConversationSidenavItem(
        this.conversationType
      );
    });
  }

  onNavItemClick(id: string) {
    if (this.conversationType === 'therapist-chats') {
      this.router.navigate(['therapist-chats', id]);
    } else if (this.conversationType === 'client-chats') {
      this.router.navigate(['client-chats', id]);
    }
  }

  onSidenavToggleClick() {
    this.p2pConversationStateService.toggleSidenavOpenState();
  }

  isMatchCurrentBrowserUrl(route: string): boolean {
    const uriSegments = this.currentBrowserUrl?.split('/');
    return uriSegments ? uriSegments.includes(route) : false;
  }
}
