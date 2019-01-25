import { Injectable } from '@angular/core';

@Injectable()
export class AppLoaderService {

  /** Reference to full screen element outside of application tree */
  private fullscreenElement = document.getElementById('loader-full');

  /** Show the loader. */
  show(): void {
    this.fullscreenElement.style.display = 'flex';
    this.fullscreenElement.style.opacity = '1';
  }

  /** Hide the loader. */
  hide(): boolean {
    this.fullscreenElement.style.opacity = '0';
    setTimeout(() => {
      this.fullscreenElement.style.display = 'none';
    }, 225);
    return true;
  }
}
