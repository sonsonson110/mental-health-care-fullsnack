import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { SidenavStateService } from '../../services/sidenav-state.service';
import { Observable } from 'rxjs';
import { ChatbotHistorySideNavItem } from '../../../../core/models/modules/ai-chats/chatbot-history-side-nav-item.model';
import { ConversationsApiService } from '../../../../core/api-services/conversations-api.service';
import { CommonModule, Location } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-ai-chat-history-side-nav',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './ai-chats-history-side-nav.component.html',
  styleUrl: './ai-chats-history-side-nav.component.scss',
})
export class AiChatsHistorySideNavComponent implements OnInit {
  isLoading = true;
  currentBrowserUrl: string | null = null;

  aiChatHistories$!: Observable<ChatbotHistorySideNavItem[]>;

  constructor(
    private router: Router,
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private sidenavStateService: SidenavStateService,
    private conversationsService: ConversationsApiService,
    location: Location
  ) {
    matIconRegistry.addSvgIcon(
      'side_navigation',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/side-navigation.svg')
    );

    this.currentBrowserUrl = location.path();
    // Listen for navigation changes to update the current chat box id
    location.onUrlChange(url => {
      this.currentBrowserUrl = url;
    });
  }

  ngOnInit(): void {
    this.aiChatHistories$ = this.sidenavStateService.aiChatHistories$;
    this.loadAiChatHistories();
  }

  private loadAiChatHistories() {
    this.conversationsService
      .getChatbotConversations()
      .subscribe((data: ChatbotHistorySideNavItem[]) => {
        this.sidenavStateService.initialAiChatHistories(data);
        this.isLoading = false;
      });
  }

  onNavItemClick(id: string) {
    this.router.navigate(['ai-chats', id]);
  }

  onSidenavToggleClick() {
    this.sidenavStateService.toggleState();
  }

  onNewConversationClick() {
    this.router.navigate(['ai-chats']);
  }

  isMatchCurrentBrowserUrl(route: string): boolean {
    const uriSegments = this.currentBrowserUrl?.split('/');
    return uriSegments ? uriSegments.includes(route) : false;
  }
}
