import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthApiService } from '../../core/api-services/auth-api.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  @Output() toggleMenu = new EventEmitter<void>();

  constructor(private authService: AuthApiService) {}

  onMenuClick() {
    this.toggleMenu.emit();
  }

  onLogoutClick() {
    this.authService.handleLogout();
  }
}
