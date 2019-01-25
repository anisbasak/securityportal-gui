import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromCore from '../../store';

@Component({
  selector: 'sp-missing-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['missing-page.component.scss'],
  template: `
    <div class="container">
      <h1>404</h1>
      <p>The page you're looking for can't be found.</p>
      <a class="button" mat-raised-button color="accent" [routerLink]="['/']">
        Return home
      </a>
    </div>
  `
})
export class MissingPageComponent implements OnInit {
  constructor(private store: Store<fromCore.CoreState>) {}

  ngOnInit() {
    this.store.dispatch(new fromCore.SetFeatureTitle({ title: 'Missing' }));
  }
}
