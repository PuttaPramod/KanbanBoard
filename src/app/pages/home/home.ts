import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  pageEnter = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.replayPageEnterAnimation();
  }

  private replayPageEnterAnimation(): void {
    this.pageEnter = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.pageEnter = true;
      });
    });
  }
}
