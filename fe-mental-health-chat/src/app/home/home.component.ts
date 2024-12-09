import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { ToolbarComponent } from '../layout/toolbar/toolbar.component';
import { LeftSideNavComponent } from '../layout/left-side-nav/left-side-nav.component';
import { Router, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthApiService } from '../core/api-services/auth-api.service';
import { filter } from 'rxjs';
import { SignalRRealtimeService } from '../core/api-services/signal-r-realtime.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatSidenavModule, ToolbarComponent, LeftSideNavComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  sideNavOpened = false;
  isLgOrLargerScreen = false;
  sideNavMode: 'over' | 'side' = 'over';

  isLoading = true;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthApiService,
    private router: Router,
    private realtimeService: SignalRRealtimeService
  ) {
    this.breakpointObserver.observe('(min-width: 992px)').subscribe(result => {
      this.sideNavMode = result.matches ? 'side' : 'over';
      this.isLgOrLargerScreen = result.matches;
    });
  }

  ngOnInit() {
    // subscribe to the isAuthenticated$ observable and redirect to login if not authenticated or logged out
    this.authService.isAuthenticated$
      .pipe(filter(isAuthenticated => !isAuthenticated))
      .subscribe(() => {
        this.router.navigate(['/login']);
      });

    // start the signalR realtime connection
    this.realtimeService.startConnection();
    this.realtimeService.connectionState$.subscribe(
      connected => (this.isLoading = !connected)
    );
  }

  toggleMenu() {
    this.sidenav.toggle();
    this.sideNavOpened = !this.sideNavOpened;
  }
}
