import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { leftInnerSideNavItems } from './constants/sidenav-item';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatSidenavModule, RouterOutlet, MatListModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  readonly navItems = leftInnerSideNavItems;
  currentBrowserUrl: string | null = null;

  constructor(
    private router: Router,
    location: Location
  ) {
    this.currentBrowserUrl = location.path();
    location.onUrlChange(url => {
      this.currentBrowserUrl = url;
    });
  }

  onClick = (route: string) => this.router.navigate(['profile', route]);

  isMatchCurrentBrowserUrl(route: string): boolean {
    const uriSegments = this.currentBrowserUrl?.split('/');
    return uriSegments ? uriSegments.includes(route) : false;
  }
}
