import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, mapTo, startWith, map } from 'rxjs/operators';
import _find from 'lodash-es/find';
import _filter from 'lodash-es/filter';

import * as fromCore from '@app/core/store';
import * as fromStore from '@app/store';

interface FeatureCard {
  title: string;
  description: string;
  link: string[];
  role?: string;
}

const ALL_FEATURES: FeatureCard[] = [
  {
    title: 'Admin',
    description: 'Perform adminstrative tasks.',
    link: ['/admin'],
    role: 'gui-admin-import',
  },
  {
    title: 'User Lookup',
    description: 'Search specifically for users in the system by a variety of traits.',
    link: ['/user-lookup'],
    role: 'gui-user-lookup',
  },
  {
    title: 'Search',
    description: 'Search for users, buildings, departments, or anything else.',
    link: ['/search'],
    role: 'gui-global-search',
  },
  {
    title: 'Profile',
    description: 'View information about yourself.',
    link: ['/profile']
  },
];

@Component({
  selector: 'page-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  template: `
    <div *ngIf="loading$ | async">
      Loading...
    </div>

    <a class="card-list-item" *ngFor="let feature of features$ | async" [routerLink]="feature.link">
      <mat-card>
        <mat-card-title>{{ feature.title }}</mat-card-title>
        <mat-card-content>
          <div class="body">{{ feature.description }}</div>
        </mat-card-content>
      </mat-card>
    </a>
  `
})
export class DashboardComponent implements OnInit {

  /** Stream of features the user has access to. */
  features$: Observable<FeatureCard[]>;

  /** Whether the features are still loading. */
  loading$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.State>,
  ) { }

  ngOnInit() {
    this.store.dispatch(new fromCore.SetFeatureTitle({ title: 'Dashboard' }));

    this.features$ = this.store.pipe(
      select(fromCore.getUserRoles),
      filter(x => !!x.length),
      map(roles =>
        ALL_FEATURES.slice().filter(x => !x.role || roles.includes(x.role))),
    );

    this.loading$ = this.features$
      .pipe(
        mapTo(false),
        startWith(true),
      );
  }

}
