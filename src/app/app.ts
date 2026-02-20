import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './pages/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar],
  templateUrl: './app.html'
})
export class App {

  showNavbar = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url;

      // Hide navbar on auth pages
      this.showNavbar = !(
        url === '/login' ||
        url === '/register'
      );
    });
  }


  logout() {
    this.router.navigate(['/login']);
  }
}
