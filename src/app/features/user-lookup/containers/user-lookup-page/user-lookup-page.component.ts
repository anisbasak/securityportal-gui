import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromCore from '@app/core/store';

@Component({
  selector: 'app-user-lookup-page',
  styleUrls: ['./user-lookup-page.compoonent.scss'],
  template: `
    <app-user-lookup-form class="form"></app-user-lookup-form>
    <app-user-lookup-results class="results"></app-user-lookup-results>
  `
})
export class UserLookupPageComponent implements OnInit {

  constructor(
    private store: Store<fromCore.CoreState>,
  ) { }

  ngOnInit() {
    this.store.dispatch(new fromCore.SetFeatureTitle({ title: 'User Lookup' }));
  }

}
