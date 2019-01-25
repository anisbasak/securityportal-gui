import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import _sortBy from 'lodash-es/sortBy';
import _filter from 'lodash-es/filter';
import _uniq from 'lodash-es/uniq';

import { ViewableResourceAddress } from '../../models';

@Component({
  selector: 'app-view-address',
  styleUrls: ['./address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="address">
      <h4>Address</h4>

      <div class="address">
        <p class="address-line" *ngFor="let street of address.streets">{{ street }}</p>
        <p class="address-line" *ngIf="address.suite">{{ address.suite}}</p>
        <p class="address-line" *ngIf="address.poBox">{{ address.poBox}}</p>
        <p class="address-line">
          {{ address.city }}<ng-container *ngIf="!!address.city && !!address.state">,</ng-container>
          {{ address.state }} {{ address.postalCode }}
        </p>
        <p class="address-line">{{ address.country }}</p>
      </div>

    </ng-container>
  `
})
export class ViewAddressComponent {
  @Input() address: ViewableResourceAddress;
}
