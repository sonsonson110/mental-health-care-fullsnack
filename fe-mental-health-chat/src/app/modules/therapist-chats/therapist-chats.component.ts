import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { CommonModule, Location } from '@angular/common';
import { TherapistHistorySidenavItem } from '../../core/models/modules/therapist-chats/therapist-history-sidenav-item.model';
import { Observable } from 'rxjs';
import { SidenavStateService } from './services/sidenav-state.service';
import { ConversationsService } from '../../core/services/conversations.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-therapist-chats',
  standalone: true,
  imports: [
    MatSidenavModule,
    RouterModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './therapist-chats.component.html',
  styleUrl: './therapist-chats.component.scss',
})
export class TherapistChatsComponent implements OnInit {
  isLoading = false;
  currentBrowserUrl: string | null = null;
  isSidenavOpen!: boolean;
  sessionUserId: string | undefined;

  therapistChatHistories$!: Observable<TherapistHistorySidenavItem[]>;

  constructor(
    private router: Router,
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private sidenavStateService: SidenavStateService,
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
      this.sidenavStateService.emitStateEvent(result.matches);
    });

    this.currentBrowserUrl = location.path();
    // Listen for navigation changes to update the current chat box id
    location.onUrlChange(url => {
      this.currentBrowserUrl = url;
    });

    this.sessionUserId = authService.getSessionUserId();
  }

  ngOnInit(): void {
    this.therapistChatHistories$ = this.sidenavStateService.therapistChatHistories$;
    this.loadTherapistChatHistories();

    this.isSidenavOpen = this.sidenavStateService.getState();
    this.sidenavStateService.sidenavState$.subscribe(state => {
      this.isSidenavOpen = state;
    });
  }

  private loadTherapistChatHistories() {
    this.conversationsService
      .getTherapistConversations()
      .subscribe((data: TherapistHistorySidenavItem[]) => {
        this.sidenavStateService.initialTherapistChatHistories(data);
        this.isLoading = false;
      });
  }

  onNavItemClick(id: string) {
    this.router.navigate(['therapist-chats', id]);
  }

  onSidenavToggleClick() {
    this.sidenavStateService.toggleState();
  }

  isMatchCurrentBrowserUrl(route: string): boolean {
    const uriSegments = this.currentBrowserUrl?.split('/');
    return uriSegments ? uriSegments.includes(route) : false;
  }
}
