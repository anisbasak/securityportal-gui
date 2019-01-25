import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromCore from '../../store';
import * as fromStore from '../../../store';

@Component({
  selector: 'sp-unauthorized-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['unauthorized-page.component.scss'],
  template: `
    <div class="container">
      <h1>Unauthorized</h1>
      <p>You are not authorized to view this page. Think this is wrong? Contact us, and we'll review your permissions.</p>
      <div class="button-group">
        <button mat-button class="button" color="accent" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Back</button>
        <a class="button" mat-raised-button color="primary" [routerLink]="['/']">Return home</a>
      </div>
    </div>
  `
})
export class UnauthorizedPageComponent implements OnInit {

  constructor(
    private store: Store<fromCore.CoreState>,
  ) { }

  ngOnInit() {
    this.store.dispatch(new fromCore.SetFeatureTitle({ title: 'Unauthorized '}));
  }

  goBack() {
    this.store.dispatch(new fromStore.Back());
  }

}
