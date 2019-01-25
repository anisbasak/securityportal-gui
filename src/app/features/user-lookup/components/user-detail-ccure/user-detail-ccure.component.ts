import { Component, Input } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'app-user-detail-ccure',
  styleUrls: ['./user-detail-ccure.component.scss'],
  template: `
    <table>
      <tr>
        <td>Active:</td>
        <td><sp-active-badge [active]="getActive()"></sp-active-badge></td>
      </tr>
      <tr>
        <td>CIDC:</td>
        <td>{{ ccure.cidc || '-'}}</td>
      </tr>
    </table>

    <ng-container *ngIf="ccure.credentials && ccure.credentials.length">
      <div class="credentials-header">Credentials:</div>
      <div class="credentials-table-wrapper">
        <table>
          <tr>
            <th>Card Number</th>
            <th>Updated Date</th>
            <th>Other</th>
          </tr>
          <tr *ngFor="let credential of ccure.credentials">
            <td>{{ credential.cardNumber }}</td>
            <td>{{ credential.updated | date: 'medium' }}</td>
            <td>
              <button mat-icon-button [satPopoverAnchorFor]="other" (click)="other.open()">
                <mat-icon>more_horiz</mat-icon>
              </button>
            </td>
            <sat-popover #other hasBackdrop backdropClass="sat-overlay-extra-light-backdrop">
              <div class="other-popover-container">
                <div class="other-popover-section">
                  <div class="other-popover-header mat-body-strong">Fields</div>
                  <table>
                    <tr>
                      <td class="label">CardInt1:</td>
                      <td>{{ credential.cardInt1 }}</td>
                    </tr>
                    <tr>
                      <td class="label">CardInt2:</td>
                      <td>{{ credential.cardInt2 }}</td>
                    </tr>
                    <tr>
                      <td class="label">CardInt3:</td>
                      <td>{{ credential.cardInt3 }}</td>
                    </tr>
                    <tr>
                      <td class="label">CardInt4:</td>
                      <td>{{ credential.cardInt4 }}</td>
                    </tr>
                  </table>
                </div>
                <div class="other-popover-section">
                  <div class="other-popover-header mat-body-strong">Flags</div>
                  <table>
                    <tr *ngFor="let flag of getFlags(credential)">
                      <td class="label">{{ flag.label }}:</td>
                      <td><sp-active-badge [active]="flag.value"></sp-active-badge></td>
                    </tr>
                  </table>
                </div>
              </div>
            </sat-popover>
          </tr>
        </table>
      </div>
    </ng-container>
  `
})
export class UserDetailCcureComponent {
  @Input() ccure: fromModels.UserCcure;

  getActive() {
    if (!this.ccure) return undefined;
    if (this.ccure.disabled === true) return false;
    if (this.ccure.disabled === false) return true;
    return undefined;
  }

  getFlags(credential: fromModels.UserCcureCredential) {
    return [
      { label: 'Is Active', value: credential.active },
      { label: 'Is Disabled', value: credential.disabled },
      { label: 'Is Enabled', value: credential.enabled },
      { label: 'Is Expired', value: credential.expired },
      { label: 'Is Lost', value: credential.lost },
      { label: 'Is Stolen', value: credential.stolen },
      { label: 'Is Template', value: credential.template },
    ];
  }
}
