import { Component, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { ToolbarComponent } from '../layout/toolbar/toolbar.component';
import { LeftSideNavComponent } from '../layout/left-side-nav/left-side-nav.component';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatSidenavModule, ToolbarComponent, LeftSideNavComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  sideNavOpened = false;
  isMdOrLargerScreen = false;
  
  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe('(min-width: 768px)')
      .subscribe((result) => {
        this.isMdOrLargerScreen = result.matches;
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
