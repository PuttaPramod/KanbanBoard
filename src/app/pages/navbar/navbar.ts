import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, Signal, computed, DestroyRef, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  menuOpen = false;
  isLoggedIn: Signal<boolean>;
  currentUser: Signal<any>;
  userEmail: Signal<string | null>;
  isAuthenticated: Signal<boolean>;
  
  // Auth routes
  private authRoutes = ['/login', '/register'];
  private appRoutes = ['/dashboard', '/tasks', '/contact', '/profile'];

  // current URL as a signal so computed signals update reactively
  currentUrl = signal('');

  // Computed signals to check current page type (auth vs app)
  isOnAuthPage = computed(() => this.authRoutes.some(r => this.currentUrl().startsWith(r)));
  isOnAppPage = computed(() => this.appRoutes.some(r => this.currentUrl().startsWith(r)));

  private initialScrollY = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private destroyRef: DestroyRef
  ) {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.currentUser = this.authService.currentUser;
    this.isAuthenticated = computed(() => this.isLoggedIn() || !!this.currentUser());
    this.userEmail = computed(() => {
      const user = this.currentUser();
      return user?.email || null;
    });
    // initialize currentUrl signal
    this.currentUrl.set(this.router.url);
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        // update current URL signal so computed signals and template update immediately
        this.currentUrl.set(this.router.url);
        this.menuOpen = false;
        this.restoreScroll();
      });
  }

  ngOnDestroy(): void {
    this.restoreScroll();
  }

  toggleMenu(): void {
    this.menuOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu(): void {
    this.menuOpen = true;
    this.preventScroll();
  }

  closeMenu(): void {
    this.menuOpen = false;
    this.restoreScroll();
  }

  async logout(): Promise<void> {
    try {
      this.closeMenu();
      await this.authService.logout();
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  private preventScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      this.initialScrollY = window.scrollY || 0;
      document.body.style.overflow = 'hidden';
    } catch (e) {
      console.warn('preventScroll failed:', e);
    }
  }

  private restoreScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      document.body.style.overflow = '';
      if (window && window.scrollTo) {
        window.scrollTo(0, this.initialScrollY);
      }
    } catch (e) {
      console.warn('restoreScroll failed:', e);
    }
  }
}
