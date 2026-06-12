import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isMobileMenuOpen: boolean = false;
  user$ = this.authService.user$;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  login() {
    this.authService.mockLogin().then(() => {
      this.toastr.success('Welcome back, Demo User!', 'Logged In');
      this.router.navigate(['/bookStore']);
    });
  }

  logout() {
    this.authService.signOut().then(() => {
      this.toastr.info('See you soon!', 'Logged Out');
      this.router.navigate(['/']);
    });
  }

  onStoreButtonClick() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/bookStore']);
    } else {
      this.toastr.info('Please log in to access the store');
    }
  }
}
