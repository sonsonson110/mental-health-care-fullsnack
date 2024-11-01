import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  @Output() toggleMenu = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  onMenuClick() {
    this.toggleMenu.emit();
  }

  onLogoutClick() {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }
}
