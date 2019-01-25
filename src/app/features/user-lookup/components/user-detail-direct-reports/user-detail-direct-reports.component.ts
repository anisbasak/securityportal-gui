import { Component, Input } from '@angular/core';
import _orderBy from 'lodash-es/orderBy';

import * as fromModels from '../../models';

@Component({
  selector: 'app-user-detail-direct-reports',
  styleUrls: ['./user-detail-direct-reports.component.scss'],
  template: `
    <div *ngIf="!directReports.length">Not available</div>
    <div *ngFor="let report of directReports" class="report">
      <a *ngIf="linkUsers && report.id" [routerLink]="['..', report.id]" class="report-link">
        <resource-avatar [avatarMd5]="report.avatar || null" [name]="report.name"></resource-avatar>
        <span class="report-name">{{ report.name || '?' }}</span>
        <span *ngIf="report.campusId" class="report-campus-id">[{{ report.campusId }}]</span>
        <span *ngIf="report.active === false" class="inactive-label">(inactive)</span>
      </a>
      <span *ngIf="!linkUsers || !report.id" class="report-link">
        <resource-avatar [avatarMd5]="report.avatar || null" [name]="report.name"></resource-avatar>
        <span class="report-name">{{ report.name || '?' }}</span>
        <span *ngIf="report.campusId" class="report-campus-id">[{{ report.campusId }}]</span>
        <span *ngIf="report.active === false" class="inactive-label">(inactive)</span>
      </span>

    </div>
  `
})
export class UserDetailDirectReportsComponent {
  // TODO: remove the need for this toggle
  @Input() linkUsers = true;

  @Input() directReports: fromModels.UserDirectReport[];
}
