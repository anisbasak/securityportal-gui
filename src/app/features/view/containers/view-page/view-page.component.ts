import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap, pluck, tap } from 'rxjs/operators';

import * as fromCore from '@app/core/store';
import * as fromStore from '@app/store';
import * as fromServices from '../../services';
import { ViewableResource } from '../../models';

@Component({
  selector: 'app-view-page',
  styleUrls: ['./view-page.component.scss'],
  template: `
    <ng-container *ngIf="resource$ | async; let resource">
      <app-view-summary [avatar]="resource.avatar" [name]="resource.name"></app-view-summary>
      <app-view-address [address]="resource.address"></app-view-address>
      <app-view-location [centroid]="resource.location"></app-view-location>
      <app-view-links [links]="resource.links" [blueprint]="resource.blueprint"></app-view-links>
      <app-view-traits [traits]="resource.traits"></app-view-traits>
    </ng-container>
  `
})
export class ViewPageComponent implements OnInit {
  resource$: Observable<ViewableResource>;

  constructor(
    private route: ActivatedRoute,
    private viewService: fromServices.ViewService,
    private store: Store<fromStore.State>,
  ) { }

  ngOnInit() {
    this.store.dispatch(new fromCore.SetFeatureTitle({ title: 'View '}));
    this.resource$ = this.route.params
      .pipe(
        pluck('id'),
        switchMap((id: string) => this.viewService.loadResource(id)),
        tap(r => this.store.dispatch(new fromCore.SetFeatureTitle({ title: `View - ${r.blueprint}` }))),
      );
  }

}
