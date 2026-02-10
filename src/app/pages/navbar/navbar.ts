import { Component, ViewChild, ElementRef, HostListener, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  menuOpen = false;
  
  @ViewChild('navMenu') navMenu!: ElementRef<HTMLDivElement>;
  @ViewChild('hamburgerBtn') hamburgerBtn!: ElementRef<HTMLButtonElement>;

  private menuItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Tasks', route: '/tasks', icon: '✓' },
  ];

  // Track initial scroll position to prevent jank
  private initialScrollY = 0;

  constructor(
    private router: Router, 
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Close menu on route changes
    this.router.events.subscribe(() => {
      this.closeMenu();
    });
  }

  ngOnDestroy(): void {
    // Cleanup on component destroy
    this.restoreScroll();
  }

  toggleMenu(): void {
    if (this.menuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu(): void {
    this.menuOpen = true;
    this.preventScroll();
    
    // Set focus to first menu item for keyboard users (WCAG compliance)
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        const firstMenuItem = this.navMenu?.nativeElement
          ?.querySelector('[role="menuitem"]') as HTMLElement;
        firstMenuItem?.focus();
      }
    }, 0);
  }

  closeMenu(): void {
    this.menuOpen = false;
    this.restoreScroll();
    
    // Return focus to hamburger button (WCAG Focus Management)
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId) && this.hamburgerBtn?.nativeElement) {
        this.hamburgerBtn.nativeElement.focus();
      }
    }, 0);
  }

  logout(): void {
    this.closeMenu();
    // Optional: Add confirmation or logout animation here
    this.router.navigate(['/login']).catch(err => {
      console.error('Navigation error:', err);
    });
  }

  // Keyboard navigation (Escape to close, Tab trapping)
  @HostListener('keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.menuOpen) {
      event.preventDefault();
      this.closeMenu();
    }
    
    // Optional: Tab trap within menu when open (WCAG Focus Trap)
    if (event.key === 'Tab' && this.menuOpen) {
      this.handleTabKey(event);
    }
  }

  private handleTabKey(event: KeyboardEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const menuElement = this.navMenu?.nativeElement;
    if (!menuElement) return;

    const focusableElements = menuElement.querySelectorAll(
      '[role="menuitem"], button'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      // Shift + Tab
      if (activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  private preventScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      this.initialScrollY = window.scrollY || 0;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
    } catch (e) {
      console.warn('preventScroll failed:', e);
    }
  }

  private restoreScroll(): void {  // ✅ FIXED - SSR SAFE
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // Restore scroll position
      if (window && window.scrollTo) {
        window.scrollTo(0, this.initialScrollY);
      }
    } catch (e) {
      console.warn('restoreScroll failed:', e);
    }
  }

  // Calculate scrollbar width to prevent layout shift - SSR SAFE
  private getScrollbarWidth(): number {
    if (!isPlatformBrowser(this.platformId)) return 0;

    try {
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll';
      outer.style.position = 'absolute';
      outer.style.top = '-9999px';
      
      document.body.appendChild(outer);
      const inner = document.createElement('div');
      outer.appendChild(inner);
      const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
      outer.parentNode?.removeChild(outer);
      
      return scrollbarWidth;
    } catch (e) {
      console.warn('getScrollbarWidth failed:', e);
      return 0;
    }
  }
}
