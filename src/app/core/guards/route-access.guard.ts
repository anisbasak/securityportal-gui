import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { take, filter, switchMap } from 'rxjs/operators';

import { OauthService } from '@app/auth/services';
import * as fromAuth from '@app/auth/store';
import { RouteAccessService } from '../services';
import * as fromStore from '../store';

@Injectable()
export class RouteAccessGuard implements CanLoad {
  constructor(
    private routeAccessService: RouteAccessService,
    private oauthService: OauthService,
    private store: Store<fromStore.CoreState>,
  ) { }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    const path = route.path;

    if (!path) {
      return true;
    } else {
      // Before checking if the user has access, be sure they have a valid token. If
      // they do not, start the Oauth process, using the to-be-activated route as the
      // next url.
      return this._awaitAuthState()
        .pipe(
          switchMap(authenticated => {
            if (!authenticated) {
              const authorizationState = this.oauthService.createRandomState();
              const nextUrl = segments.map(seg => seg.path).join('/');
              this.store.dispatch(new fromAuth.Authorize({ nextUrl, authorizationState }));
              return of(false);
            }

            return this.routeAccessService.getRouteAccess(path);
          }),
          take(1),
        );
    }
  }

  private _awaitAuthState(): Observable<boolean> {
    return this.store.pipe(
      select(fromAuth.getTokenConfirmed),
      filter(confirmed => confirmed),
      take(1),
      switchMap(() => this.store.select(fromAuth.getIsAuthenticated)),
    );
  }
}
