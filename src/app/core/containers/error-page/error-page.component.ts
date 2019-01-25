import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromCore from '../../store';

@Component({
  selector: 'sp-error-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['error-page.component.scss'],
  template: `
    <div class="container">
      <h1>Server Error</h1>
      <p>
        The server is experiencing difficulties, and our team has been notified of the issue.
        Please <a href="mailto:sat@ncsu.edu">email us</a> or call <b>(919) 513-3111</b> if your
        security need is urgent.
      </p>
      <a class="button" mat-raised-button color="accent" href="https://sat.ehps.ncsu.edu">SAT Website</a>
    </div>
  `
})
export class ErrorPageComponent implements OnInit {

  constructor(
    private store: Store<fromCore.CoreState>,
  ) { }

  ngOnInit() {
    this.store.dispatch(new fromCore.SetFeatureTitle({ title: 'Error' }));
  }
}
