import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
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
import { AuthService } from '../../../core/services/auth.service';
import { ConversationsService } from '../../../core/services/conversations.service';

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
  providers: [P2pConversationSidenavStateService],
  templateUrl: './p2p-conversation.component.html',
  styleUrl: './p2p-conversation.component.scss',
})
export class P2pConversationComponent {
  isLoading = false;
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
    private conversationsService: ConversationsService,
    location: Location,
    breakpointObserver: BreakpointObserver,
    authService: AuthService
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
  }

  private loadchatHistories() {
    console.log('this.conversationType', this.conversationType);
    if (this.conversationType === 'therapist-chats') {
      this.conversationsService
        .getTherapistConversations()
        .subscribe((data: P2pConversationSidenavItem[]) => {
          this.p2pConversationSidenavStateService.initialP2pConversationSidenavItem(data);
          this.isLoading = false;
        });
    }
  }

  onNavItemClick(id: string) {
    this.router.navigate(['therapist-chats', id]);
  }

  onSidenavToggleClick() {
    this.p2pConversationSidenavStateService.toggleState();
  }

  isMatchCurrentBrowserUrl(route: string): boolean {
    const uriSegments = this.currentBrowserUrl?.split('/');
    return uriSegments ? uriSegments.includes(route) : false;
  }
}
