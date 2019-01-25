import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromCore from '@app/core/store';
import * as fromModels from '../../models';
import * as fromStore from '../../store';
import { UserGroups } from '@app/core/constants';

@Component({
  selector: 'app-user-detail-page-wrapper',
  styleUrls: ['./user-detail-page-wrapper.component.scss'],
  template: `
    <button
      mat-stroked-button
      class="back-button"
      color="accent"
      (click)="back()">
      ← Previous
    </button>
    <app-user-detail-page
      [user]="user$ | async"
      [superUser]="isSuperUser$ | async"
      [linkUsers]="true">
    </app-user-detail-page>
  `
})
export class UserDetailPageWrapperComponent implements OnInit {

  user$: Observable<fromModels.User>;
  isSuperUser$: Observable<boolean>;

  constructor(
    private store: Store<fromCore.CoreState>,
    private location: Location,
  ) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(fromStore.getSelectedUser));
    this.isSuperUser$ = this.store.pipe(select(fromCore.userHasRole(UserGroups.SuperUsers)));
    this.store.dispatch(new fromCore.SetFeatureTitle({ title: 'User Lookup' }));
  }

  back() {
    this.location.back();
  }

}
