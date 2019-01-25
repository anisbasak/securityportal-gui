import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { UserGroups } from '@app/core/constants';
import * as fromCore from '@app/core/store';
import * as fromStore from '@app/store';
import * as fromModels from '@app/core/models';

@Component({
  selector: 'page-profile',
  styleUrls: ['./profile.component.scss'],
  template: `
    <app-user-detail-page
      [user]="profile$ | async"
      [superUser]="isSuperUser$ | async"
      [linkUsers]="false">
    </app-user-detail-page>
  `
})
export class ProfileComponent implements OnInit {
  profile$: Observable<fromModels.ProfileUser>;
  isSuperUser$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.State>,
  ) {
    this.profile$ = this.store.pipe(select(fromCore.getProfileUser));
    this.isSuperUser$ = this.store.pipe(select(fromCore.userHasRole(UserGroups.SuperUsers)));
  }

  ngOnInit() {
    this.store.dispatch(new fromCore.SetFeatureTitle({ title: 'Profile '}));
  }

}
