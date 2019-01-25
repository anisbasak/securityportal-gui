import { Component, Input } from '@angular/core';
import _orderBy from 'lodash-es/orderBy';

import * as fromModels from '../../models';

@Component({
  selector: 'app-user-detail-employment',
  styleUrls: ['./user-detail-employment.component.scss'],
  template: `
    <div *ngIf="!employments.length">Not available</div>
    <table *ngIf="employments.length">
      <tr>
        <th>Iteration</th>
        <th>Active</th>
        <th>FTE</th>
        <th>Dates</th>
        <th>Supervisor</th>
        <th>More Details</th>
      </tr>
      <tr *ngFor="let employment of employments">
        <td>{{ employment.iteration }}</td>
        <td><sp-active-badge [active]="employment.active"></sp-active-badge></td>
        <td>{{ employment.fte }}</td>
        <td>{{ employment.dateRange || '-' }}</td>
        <td>
          <ng-container *ngIf="employment.supervisor; let supervisor">
            <a *ngIf="linkUsers && supervisor.id"
              class="supervisor-link"
              [routerLink]="['..', supervisor.id]">
              <resource-avatar [avatarMd5]="supervisor.avatar || null" [name]="supervisor.name"></resource-avatar>
              <span class="supervisor-name">{{ supervisor.name || '?' }}</span>
              <span *ngIf="supervisor.campusId" class="supervisor-campus-id">[{{ supervisor.campusId }}]</span>
            </a>
            <span *ngIf="!linkUsers || !supervisor.id"
              class="supervisor-link">
              <resource-avatar [avatarMd5]="supervisor.avatar || null" [name]="supervisor.name"></resource-avatar>
              <span class="supervisor-name">{{ supervisor.name || '?' }}</span>
              <span *ngIf="supervisor.campusId" class="supervisor-campus-id">[{{ supervisor.campusId }}]</span>
            </span>
          </ng-container>
          <ng-container *ngIf="!employment.supervisor">-</ng-container>
        </td>
        <td>
          <button mat-icon-button [satPopoverAnchorFor]="details" (click)="details.open()">
            <mat-icon>more_horiz</mat-icon>
          </button>
        </td>
        <sat-popover #details hasBackdrop backdropClass="sat-overlay-extra-light-backdrop">
          <div class="details-popover-container">
            <div class="details-popover-header mat-body-strong">Details</div>
            <table>
              <tr *ngFor="let detail of employment.details">
                <td class="label">{{ detail.name }}:</td>
                <td>{{ detail.value || '-' }}</td>
              </tr>
            </table>
          </div>
        </sat-popover>
      </tr>
    </table>
  `
})
export class UserDetailEmploymentComponent {
  // TODO: remove the need for this toggle
  @Input() linkUsers = true;

  @Input() employments: fromModels.UserEmployment[];
}
