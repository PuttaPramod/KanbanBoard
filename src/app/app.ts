import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './pages/navbar/navbar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar],
  templateUrl: './app.html'
})
export class App {

  showNavbar = false;
  isAuthPage = false;

  constructor(private router: Router) {
    this.updateNavbarVisibility(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateNavbarVisibility(this.router.url));
  }


  logout() {
    this.router.navigate(['/login']);
  }

  private updateNavbarVisibility(url: string): void {
    const path = this.router.parseUrl(url).root.children['primary']?.segments
      .map(segment => segment.path)
      .join('/') || '';

    this.isAuthPage = path === 'login' || path === 'register';
    this.showNavbar = !this.isAuthPage;
  }
}
