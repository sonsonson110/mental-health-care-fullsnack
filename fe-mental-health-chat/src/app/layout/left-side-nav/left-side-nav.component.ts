import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { AuthApiService } from '../../core/api-services/auth-api.service';
import { UserType } from '../../core/models/enums/user-type.enum';
import { userTypes } from '../../core/constants/user-type.constant';
import { Location } from '@angular/common';
import { baseNavItems, therapistNavItems } from '../../core/constants/nav-items.constant';

@Component({
  selector: 'app-left-side-nav',
  standalone: true,
  imports: [MatListModule, MatIconModule, MatDividerModule],
  templateUrl: './left-side-nav.component.html',
  styleUrl: './left-side-nav.component.scss',
})
export class LeftSideNavComponent {
  readonly baseNavItems = baseNavItems;
  readonly therapistNavItems = therapistNavItems;
  readonly sessionUserRoles: string | string[] | undefined;
  currentBrowserUrl: string | null = null;

  constructor(
    private router: Router,
    authService: AuthApiService,
    location: Location
  ) {
    this.sessionUserRoles = authService.getSessionUserRole();
    this.currentBrowserUrl = location.path();
    // Listen for navigation changes to update the current chat box id
    location.onUrlChange(url => {
      this.currentBrowserUrl = url;
    });
  }

  onClick(route: string) {
    this.router.navigate([route]);
  };

  isMatchCurrentBrowserUrl(route: string): boolean {
    const uriSegments = this.currentBrowserUrl?.split('/');
    return uriSegments ? uriSegments.includes(route) : false;
  }

  hasTherapistRole(): boolean {
    const therapistValue = userTypes.find(t => t.key === UserType.THERAPIST)?.value;
    return therapistValue
      ? this.sessionUserRoles?.includes(therapistValue) ?? false
      : false;
  }
}
