import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SidenavStateService } from './services/sidenav-state.service';
import { AiChatsHistorySideNavComponent } from './components/ai-chats-history-side-nav/ai-chats-history-side-nav.component';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [MatSidenavModule, AiChatsHistorySideNavComponent, RouterModule,],
  templateUrl: './ai-chats.component.html',
  styleUrl: './ai-chats.component.scss',
})
export class AiChatsComponent implements OnInit {
  isSidenavOpen!: boolean;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private sidenavStateService: SidenavStateService
  ) {
    this.breakpointObserver.observe('(min-width: 490px)').subscribe(result => {
      this.sidenavStateService.emitStateEvent(result.matches);
    });
  }

  ngOnInit(): void {
    this.isSidenavOpen = this.sidenavStateService.getState();
    this.sidenavStateService.sidenavState$.subscribe(state => {
      this.isSidenavOpen = state;
    });
  }
}
