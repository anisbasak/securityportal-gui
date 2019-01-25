import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { tap, filter, switchMap, map, startWith } from 'rxjs/operators';

import * as fromAuth from '../../../auth';
import * as fromStore from '../../store';
import * as fromModels from '../../models';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'sp-layout',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sp-appbar
      class="appbar mat-elevation-z4"
      title="Security Portal"
      (toggleSidenav)="toggleSidenav()"
      (signOut)="signOut()">
      <sp-global-spinner
        *ngIf="loading$ | async"
        class="sat-white-spinner">
      </sp-global-spinner>
      <resource-avatar
        [name]="userName$ | async"
        [avatarMd5]="userAvatarMd5$ | async">
      </resource-avatar>
    </sp-appbar>

    <div class="sidenav-wrapper">
      <mat-sidenav-container
        class="app-sidenav-container"
        (backdropClick)="closeSidenav()">
        <mat-sidenav
          disableClose
          [opened]="sidenavOpen$ | async"
          [mode]="sidenavMode$ | async"
          (keydown.escape)="closeSidenav()">
          <sp-menu [menu]="menu$ | async"></sp-menu>
        </mat-sidenav>

        <div class="app-container">
          <sp-featurebar
            [title]="featureTitle$ | async"
            [backEnabled]="featureBackEnabled$ | async"
            [crumbs]="featureCrumbs$ | async"
            [tabs]="featureTabs$ | async"
            (goBack)="featurebarBack()">
          </sp-featurebar>

          <ng-content></ng-content>
        </div>
      </mat-sidenav-container>
    </div>
  `
})
export class LayoutComponent implements OnInit, OnDestroy {

  // layout
  sidenavMode$: Observable<'side' | 'over'>;
  sidenavOpen$: Observable<boolean>;
  menu$: Observable<fromModels.MenuObject[]>;

  // loading
  loading$: Observable<boolean>;

  // user
  userName$: Observable<any>;
  userAvatarMd5$: Observable<string>;

  // featurebar
  featureTitle$: Observable<string>;
  featureBackEnabled$: Observable<boolean>;
  featureCrumbs$: Observable<fromModels.FeaturebarLink[]>;
  featureTabs$: Observable<fromModels.FeaturebarLink[]>;

  private _breakpointSubscription: Subscription;

  constructor(
    private store: Store<fromStore.CoreState>,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit() {
    this._breakpointSubscription = this.breakpointObserver
      .observe('(min-width: 920px)')
      .pipe(
        tap(state => this.store.dispatch(new fromStore.ViewportResize(state.matches)))
      )
      .subscribe();

    this.sidenavMode$ = this.store.pipe(select(fromStore.getSidenavMode));
    this.sidenavOpen$ = this.store.pipe(select(fromStore.getSidenavOpen));
    this.menu$ = this.store.pipe(select(fromStore.getMenu));
    this.loading$ = this.store.pipe(select(fromStore.getShowLoader));
    this.userName$ = this.getUserWhenLoaded().pipe(map(user => user.name));
    this.userAvatarMd5$ = this.getUserWhenLoaded().pipe(map(user => user.avatar), startWith(undefined));
    this.featureTitle$ = this.store.pipe(select(fromStore.getFeaturebarTitle));
    this.featureBackEnabled$ = this.store.pipe(select(fromStore.getFeaturebarBackEnabled));
    this.featureCrumbs$ = this.store.pipe(select(fromStore.getFeaturebarCrumbs));
    this.featureTabs$ = this.store.pipe(select(fromStore.getFeaturebarTabs));
  }

  ngOnDestroy() {
    this._breakpointSubscription.unsubscribe();
  }

  getUserWhenLoaded() {
    return this.store.pipe(
      select(fromStore.getUserLoaded),
      filter(loaded => loaded),
      switchMap(() => this.store.pipe(select(fromStore.getUser))),
    );
  }

  toggleSidenav() {
    this.store.dispatch(new fromStore.ToggleSidenav());
  }

  closeSidenav() {
    this.store.dispatch(new fromStore.CloseSidenav());
  }

  signOut() {
    this.store.dispatch(new fromAuth.RevokeToken());
  }

  featurebarBack() {
    // TODO: implement here or in an effect
  }

}
