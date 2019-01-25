import { Component, Input } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'app-user-detail-hero',
  styleUrls: ['./user-detail-hero.component.scss'],
  template: `
    <!-- Gallery -->
    <resource-gallery
      class="user-detail-gallery"
      [avatar]="user.avatar"
      [name]="user.name"
      [images]="user.images">
    </resource-gallery>

    <div class="user-detail-headline">
      <div class="user-detail-name mat-display-1">
        {{ user.name }}
        <button
          mat-icon-button
          class="user-detail-dates-button"
          [satPopoverAnchorFor]="datesPopover"
          (click)="datesPopover.open()">
          <mat-icon>access_time</mat-icon>
        </button>
      </div>

      <table class="user-detail-headline-table">
        <tr>
          <td class="label">Username:</td>
          <td>{{ user.username || '-' }}</td>
        </tr>
        <tr>
          <td class="label">Unity ID:</td>
          <td>{{ user.unityId || '-' }}</td>
        </tr>
        <tr>
          <td class="label">Campus ID:</td>
          <td>{{ user.campusId || '-' }}</td>
        </tr>
        <tr>
          <td class="label">Job Title:</td>
          <td>{{ user.jobTitle || '-' }}</td>
        </tr>
        <tr>
          <td class="label">Department:</td>
          <td>{{ user.department || '-' }}</td>
        </tr>
      </table>
    </div>

    <!-- Dates Popover -->
    <sat-popover #datesPopover hasBackdrop yAlign="below" backdropClass="sat-overlay-extra-light-backdrop">
      <div class="dates-popover-container">
        <div class="date-popover-header mat-body-strong">Dates</div>
        <table>
          <tr>
            <td class="label">Created:</td>
            <td>{{ user.dates.created | date: 'medium' }}</td>
          </tr>
          <tr>
            <td class="label">Updated:</td>
            <td>{{ user.dates.updated | date: 'medium' }}</td>
          </tr>
        </table>
      </div>
    </sat-popover>
  `
})
export class UserDetailHeroComponent {
  @Input() user: fromModels.User;
}
