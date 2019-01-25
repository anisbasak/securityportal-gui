import { Component, Input } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'app-user-detail-wolfone',
  styleUrls: ['./user-detail-wolfone.component.scss'],
  template: `
    <div>Patron ID: {{ wolfone.patron?.patronId || '-' }}</div>
    <ng-container *ngIf="wolfone.credentials && wolfone.credentials.length">
      <div class="credentials-header">Credentials:</div>
      <div class="credentials-table-wrapper">
        <table>
          <tr>
            <th>Value</th>
            <th>Active</th>
            <th>History</th>
          </tr>
          <tr *ngFor="let credential of wolfone.credentials">
            <td>{{ credential.value || '-' }}</td>
            <td><sp-active-badge></sp-active-badge></td>
            <td>
              <button mat-icon-button [satPopoverAnchorFor]="history" (click)="history.open()">
                <mat-icon>more_horiz</mat-icon>
              </button>
            </td>
            <sat-popover #history hasBackdrop backdropClass="sat-overlay-extra-light-backdrop">
              <div class="history-popover-container">
                <div class="history-popover-header mat-body-strong">History</div>
                <table>
                  <tr *ngFor="let hist of credential.history">
                    <td class="label">{{ hist.modificationType || '-' }}</td>
                    <td>{{ hist.date | date:'medium' }}</td>
                  </tr>
                </table>
              </div>
            </sat-popover>
          </tr>
        </table>
      </div>
    </ng-container>
  `
})
export class UserDetailWolfOneComponent {
  @Input() wolfone: fromModels.UserWolfOne;
}
