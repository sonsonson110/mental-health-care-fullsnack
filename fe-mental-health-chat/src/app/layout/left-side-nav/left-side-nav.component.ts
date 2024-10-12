import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import {
  baseNavItems,
  therapistNavItems,
} from '../../shared/constants/nav-items.constant';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserType } from '../../core/models/enums/user-type.enum';
import { userTypes } from '../../core/constants/user-type.constant';
import { Location } from '@angular/common';

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
  readonly sessionUserRole;
  currentBrowserUrl: string | null = null;

  constructor(
    private router: Router,
    authService: AuthService,
    location: Location
  ) {
    this.sessionUserRole =
      authService.decodeToken()?.[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];
    this.currentBrowserUrl = location.path();
    // Listen for navigation changes to update the current chat box id
    location.onUrlChange(url => {
      this.currentBrowserUrl = url;
    });
  }

  onClick = (route: string) => this.router.navigate([route]);

  isMatchCurrentBrowserUrl(route: string): boolean {
    const uriSegments = this.currentBrowserUrl?.split('/');
    return uriSegments ? uriSegments.includes(route) : false;
  }

  hasTherapistRole(): boolean {
    const therapistValue = userTypes.find(t => t.key === UserType.THERAPIST)?.value;
    return this.sessionUserRole === therapistValue;
  }
}
