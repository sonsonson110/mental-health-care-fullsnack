import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { SidenavStateService } from '../../services/sidenav-state.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ChatbotHistorySideNavItem } from '../../../../core/models/modules/ai-chat/chatbot-history-side-nav-item.model';
import { ConversationsService } from '../../../../core/services/conversations.service';
import { CommonModule } from '@angular/common';
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
  templateUrl: './ai-chat-history-side-nav.component.html',
  styleUrl: './ai-chat-history-side-nav.component.scss',
})
export class AiChatHistorySideNavComponent implements OnInit {
  isLoading = true;
  aiChatHistories$!: Observable<ChatbotHistorySideNavItem[]>;

  constructor(
    private router: Router,
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private sidenavStateService: SidenavStateService,
    private conversationsService: ConversationsService
  ) {
    matIconRegistry.addSvgIcon(
      'side_navigation',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/side-navigation.svg')
    );
  }

  ngOnInit(): void {
    this.aiChatHistories$ = this.sidenavStateService.aiChatHistories$;
    this.loadAiChatHistories();
  }

  private loadAiChatHistories() {
    this.conversationsService
      .getChatbotConversationsByUserIdAsync()
      .subscribe((data: ChatbotHistorySideNavItem[]) => {
        this.sidenavStateService.initialAiChatHistories(data);
        this.isLoading = false;
      });
  }

  onNavItemClick(id: string) {
    this.router.navigate(['ai-chat', id]);
  }

  onSidenavToggleClick() {
    this.sidenavStateService.toggleState();
  }

  onNewConversationClick() {
    this.router.navigate(['ai-chat']);
  }
}
