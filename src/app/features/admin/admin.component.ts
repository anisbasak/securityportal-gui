import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';

import * as fromCore from '@app/core/store';
import * as fromStore from '@app/store';
import { AdminFeature, FEATURES } from './features/admin-features';

@Component({
  selector: 'admin-pages',
  styleUrls: ['./admin.component.scss'],
  template: `
    <!-- All roles -->
    <mat-card>
      <mat-card-title class="headline">Your available roles</mat-card-title>
      <mat-card-content class="body">
        <mat-chip-list *ngIf="(roles$ | async)?.length; else noRoles" class="sat-equal-chip-margin">
          <mat-chip [selectable]="false"
            *ngFor="let role of (roles$ | async)">
            {{ role }}
          </mat-chip>
        </mat-chip-list>
        <ng-template #noRoles>No available roles</ng-template>
      </mat-card-content>
    </mat-card>

    <!-- Feature cards -->
    <div class="admin-features">
      <a class="feature-list-item" *ngFor="let feature of features$ | async" [routerLink]="feature.link">
        <mat-card>
          <mat-card-title>{{ feature.title }}</mat-card-title>
          <mat-card-content>
            <div class="body">{{ feature.description }}</div>
          </mat-card-content>
        </mat-card>
      </a>
    </div>
  `
})
export class AdminComponent implements OnInit {

  /** Stream of role names */
  roles$: Observable<string[]>;

  /** Stream of features that the user has access to */
  features$: Observable<AdminFeature[]>;

  constructor(
    private store: Store<fromStore.State>,
  ) { }

  public ngOnInit() {
    this.store.dispatch(new fromCore.SetFeatureTitle({ title: 'Admin' }));

    // Get a list of roles the user has
    this.roles$ = this.store.pipe(select(fromCore.getUserRoles));

    // Get a list of features the user has access to
    this.features$ = this.roles$
      .pipe(
        map(roles => {
          // Add a wildcard role
          roles = [...roles, '*'];

          return FEATURES.filter(f => roles.includes(f.role));
        })
      );
  }

}
