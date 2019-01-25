import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, take, filter, switchMap } from 'rxjs/operators';

import * as fromRoot from '../../store';
import * as fromStore from '../store';
import { OauthService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private store: Store<fromStore.AuthState>,
    private oauthService: OauthService,
  ) {}

  /**
   * Allow activation if the the user is authenticated. If not, start the OAuth flow, using
   * the current route as the "next url" to be directed to after authentication is complete.
   */
  canActivate(): Observable<boolean> {
    return combineLatest(
      this._awaitAuthState(),
      this._getRouterUrl(),
    ).pipe(
      take(1),
      map(([authenticated, nextUrl]) => {
        if (!authenticated) {
          const authorizationState = this.oauthService.createRandomState();
          this.store.dispatch(new fromStore.Authorize({ nextUrl, authorizationState }));
          return false;
        }

        return true;
      }),
    );
  }

  private _awaitAuthState(): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.getTokenConfirmed),
      filter(confirmed => confirmed),
      take(1),
      switchMap(() => this.store.select(fromStore.getIsAuthenticated)),
    );
  }

  private _getRouterUrl(): Observable<string> {
    return this.store.pipe(
      select(fromRoot.getRouterState),
      map(({ state }) => state.url)
    );
  }

}
