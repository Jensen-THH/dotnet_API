import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  showProfileMenu = false;
  showMobileMenu = false;
  authService = inject(AuthService);
  router = inject(Router)
  
  isLoggedIn = ():boolean => {
    return this.authService.isLoggedIn();
  }

  getUserDetail = () => {
    const userDetail: any = this.authService.getUserDetail();
    return userDetail;
  }
   toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout(): void {
    this.authService.logout()
  }

  // Handle clicks outside the component to close the menu
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu') && !target.closest('.profile-button')) {
      this.showProfileMenu = false;
    }
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }
}
