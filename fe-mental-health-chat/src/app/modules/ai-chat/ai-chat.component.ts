import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AiChatHistorySideNavComponent } from './components/ai-chat-history-side-nav/ai-chat-history-side-nav.component';
import { RouterModule } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SidenavStateService } from './services/sidenav-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [MatSidenavModule, AiChatHistorySideNavComponent, RouterModule,],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss',
})
export class AiChatComponent implements OnInit, OnDestroy {
  private sidenavStateSubscription!: Subscription;
  isSidenavOpen!: boolean;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private sidenavStateService: SidenavStateService
  ) {
    this.breakpointObserver.observe('(min-width: 490px)').subscribe(result => {
      this.sidenavStateService.emitStateEvent(result.matches);
    });
  }
  ngOnDestroy(): void {
    this.sidenavStateSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.isSidenavOpen = this.sidenavStateService.getState();
    this.sidenavStateSubscription = this.sidenavStateService.sidenavState$.subscribe(state => {
      this.isSidenavOpen = state;
    });
  }
}
