import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationCancel, NavigationEnd, NavigationStart } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import * as fromAuth from '../../../auth/store';
import * as fromServices from '../../services';
import * as fromStore from '../../store';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
        <sp-layout>
        <!-- Page content -->

        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </sp-layout>

  `,
})
export class AppComponent implements OnInit {

  constructor(
    private store: Store<fromStore.CoreState>,
    private router: Router,
    private appLoader: fromServices.AppLoaderService,
    private loadingSerice: fromServices.LoadingService,
  ) {
    this.subscribeToRouterEvents();
  }

  ngOnInit() {
    // If the token's validity is unconfirmed on init, confirm it. This is important
    // to do here, first, because portions of the app that rely on a known authentication
    // state must await the confirmation result before proceeding.
    //
    // TODO(ux): if the user refreshes the application when the token's remaining life
    // is within the 'warning window', they'll receive a warning immediately. This is because
    // the bootstrapping requests (load rules, profile, etc) that actually extend the
    // lifetime must await this confirmation. This dependency should be readdressed.
    this.store.pipe(
      select(fromAuth.getTokenConfirmed),
      filter(confirmed => !confirmed),
      take(1),
    ).subscribe(() => this.store.dispatch(new fromAuth.ConfirmToken()));

    const signIn$ = this._awaitAuthState().pipe(filter(auth => auth));
    const signOut$ = this._awaitAuthState().pipe(filter(auth => !auth));

    const userLoaded$ = this.store.pipe(
      select(fromStore.getUserLoaded),
      filter(user => !!user),
    );

    // Load a bunch of necessary data once authenticated
    signIn$.subscribe(() => {
      this.store.dispatch(new fromStore.LoadUser());
      this.store.dispatch(new fromStore.LoadMenu());
      this.store.dispatch(new fromStore.LoadApiOptions());
      this.store.dispatch(new fromStore.LoadApiVersion());
    });

    // Hide the app loader and bootstrap the rest of the application when the
    // user object has loaded
    userLoaded$.subscribe(() => this.appLoader.hide());

    // Discard the user object and cover up the application with the loader
    // when signing out
    signOut$.subscribe(() => {
      this.appLoader.show();
      this.store.dispatch(new fromStore.DiscardUser());
    });
  }

  private _awaitAuthState(): Observable<boolean> {
    return this.store.pipe(
      select(fromAuth.getTokenConfirmed),
      filter(confirmed => confirmed),
      take(1),
      switchMap(() => this.store.select(fromAuth.getIsAuthenticated)),
    );
  }

  private subscribeToRouterEvents(): void {
    // Map to translate loading entity ids to router event ids.
    // This map likely goes against the principles of redux and may need to change.
    const loadIdMap: { [id: number]: number } = {};

    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          const id = this.loadingSerice.getNextId();
          loadIdMap[id] = event.id;
          this.store.dispatch(new fromStore.LoadingStart({
            id,
            delay: 200,
            data: `router: ${event.url}`
          }));
        }

        if (event instanceof NavigationCancel || event instanceof NavigationEnd) {
          const id = +Object.keys(loadIdMap).find(key => loadIdMap[key] === event.id);
          this.store.dispatch(new fromStore.LoadingComplete({ id }));
          this.store.dispatch(new fromStore.CloseSidenavWhenSmall());
        }
      });
  }

}
