import { Component, Input } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'app-user-detail-contact',
  styleUrls: ['./user-detail-contact.component.scss'],
  template: `
    <!-- Phone -->
    <table>
      <tr *ngFor="let phoneNumber of contact.phone; first as isFirstRow">
        <td><ng-container *ngIf="isFirstRow">Phone:</ng-container></td>
        <td>
          <a href="tel:{{ phoneNumber.value }}">{{ formatPhone(phoneNumber.value) }}</a>
          <span class="label" *ngIf="phoneNumber.label">({{ phoneNumber.label }})</span>
        </td>
      </tr>
      <tr *ngIf="!contact.phone.length">
        <td>Phone:</td><td>Not available</td>
      </tr>
    </table>

    <!-- Email -->
    <table>
      <tr *ngFor="let email of contact.emails; first as isFirstRow">
        <td [ngClass]="{ 'first-row': isFirstRow }"><ng-container *ngIf="isFirstRow">Email:</ng-container></td>
        <td [ngClass]="{ 'first-row': isFirstRow }">
          <a href="mailto:{{ email.value }}">{{ email.value }}</a>
          <span class="label" *ngIf="email.label">({{ email.label }})</span>
        </td>
      </tr>
      <tr *ngIf="!contact.emails.length">
        <td>Email:</td><td>Not available</td>
      </tr>
    </table>
  `
})
export class UserDetailContactComponent {
  @Input() contact: fromModels.UserContact;

  expandedPhone = false;
  expandedEmails = false;

  formatPhone(number: string) {
    return format(number, '(NNN) NNN-NNNN');
  }
}

/** Utiltity for formatting phone numbers. */
function format(phoneNumber: string, formatString: string) {
  const regex = /^[\+\d{1,3}\-\s]*\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const formatted = phoneNumber.replace(regex, '$1$2$3');

  for (let i = 0; i < formatted.length; i++ ) {
    formatString = formatString.replace('N', formatted[i]);
  }

  return formatString;
}
