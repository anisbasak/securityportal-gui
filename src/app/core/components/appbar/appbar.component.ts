import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sp-appbar',
  styleUrls: ['./appbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button class="sidenav-toggle" (click)="toggleSidenav.emit()">
        <mat-icon>menu</mat-icon>
      </button>
      <div class="fill-remaining-space">
        {{ title }}
      </div>
      <ng-content select="sp-global-spinner"></ng-content>
      <button mat-icon-button [matMenuTriggerFor]="menu" class="menu-button">
        <ng-content select="resource-avatar"></ng-content>
      </button>
    </mat-toolbar>

    <mat-menu #menu>
      <a mat-menu-item [routerLink]="['/profile']">Profile</a>
      <a mat-menu-item [routerLink]="['/help']">Help</a>
      <button mat-menu-item (click)="signOut.emit()">Sign Out</button>
    </mat-menu>
  `
})
export class AppbarComponent {
  @Input() title: string;
  @Output() toggleSidenav = new EventEmitter();
  @Output() signOut = new EventEmitter();
}
