import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'sp-featurebar',
  styleUrls: ['./featurebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Crumbs -->
    <div class="crumbs" *ngIf="!!crumbs?.length">
      <ng-container *ngFor="let crumb of crumbs; let last=last;">
        <a class="crumb" [routerLink]="crumb.link" [class.disabled]="crumb.disabled">{{ crumb.label }}</a>
        <mat-icon *ngIf="!last" class="chevron">chevron_right</mat-icon>
      </ng-container>
    </div>

    <!-- Main -->
    <div class="main">
      <button mat-icon-button *ngIf="backEnabled" (click)="goBack.emit()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <div class="title">{{ title }}</div>
    </div>

    <!-- Tabs -->
    <nav mat-tab-nav-bar *ngIf="!!tabs?.length"
      backgroundColor="primary"
      class="sat-featurebar-tabs">
      <a mat-tab-link
        *ngFor="let tab of tabs"
        [disabled]="tab.disabled"
        [routerLink]="tab.link"
        routerLinkActive #rla="routerLinkActive"
        [active]="rla.isActive">
        {{ tab.label | uppercase }}
      </a>
    </nav>
  `
})
export class FeaturebarComponent {
  @Input() title: string;
  @Input() backEnabled: boolean;
  @Input() crumbs: fromModels.FeaturebarLink[];
  @Input() tabs: fromModels.FeaturebarLink[];
  @Output() goBack = new EventEmitter<void>();
}
