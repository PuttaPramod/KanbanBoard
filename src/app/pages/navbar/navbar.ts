import { Component, ViewChild, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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

  constructor(private router: Router, private elementRef: ElementRef) {}

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
      const firstMenuItem = this.navMenu?.nativeElement
        .querySelector('[role="menuitem"]') as HTMLElement;
      firstMenuItem?.focus();
    }, 0);
  }

  closeMenu(): void {
    this.menuOpen = false;
    this.restoreScroll();
    
    // Return focus to hamburger button (WCAG Focus Management)
    setTimeout(() => {
      this.hamburgerBtn?.nativeElement?.focus();
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
    this.initialScrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
  }

  private restoreScroll(): void {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    window.scrollY = this.initialScrollY;
  }

  // Calculate scrollbar width to prevent layout shift
  private getScrollbarWidth(): number {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode?.removeChild(outer);
    return scrollbarWidth;
  }
}
