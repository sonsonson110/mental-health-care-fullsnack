import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { baseNavItems, therapistNavItems } from '../../shared/constants/nav-items.constant';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  onClick = (route: string) => this.router.navigate([route]);
}
