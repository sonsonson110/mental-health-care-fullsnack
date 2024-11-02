import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { ToolbarComponent } from '../layout/toolbar/toolbar.component';
import { LeftSideNavComponent } from '../layout/left-side-nav/left-side-nav.component';
import { Router, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from '../core/services/auth.service';
import { filter } from 'rxjs';

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
  isMdOrLargerScreen = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {
    this.breakpointObserver.observe('(min-width: 768px)').subscribe(result => {
      this.isMdOrLargerScreen = result.matches;
    });
  }

  ngOnInit() {
    // subscribe to the isAuthenticated$ observable and redirect to login if not authenticated or logged out
    this.authService.isAuthenticated$.pipe(
      filter(isAuthenticated => !isAuthenticated)
    ).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  toggleMenu() {
    this.sidenav.toggle();
    this.sideNavOpened = !this.sideNavOpened;
  }

  getSidenavMode(): 'side' | 'over' {
    return this.isMdOrLargerScreen ? 'side' : 'over';
  }
}
