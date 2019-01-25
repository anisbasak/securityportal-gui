import { Component, Input } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'app-user-detail-organization',
  styleUrls: ['./user-detail-organization.component.scss'],
  template: `
    <div *ngIf="!organization.name">Not available</div>
    <ng-container *ngIf="organization.name">
      <div>{{ organization.name }}</div>
      <p *ngIf="organization.ou; let ou">
        {{ ou.name }} <span *ngIf="ou.code">({{ ou.code }})</span>
      </p>
    </ng-container>
  `
})
export class UserDetailOrganizationComponent {
  @Input() organization: fromModels.UserOrganization;
}
