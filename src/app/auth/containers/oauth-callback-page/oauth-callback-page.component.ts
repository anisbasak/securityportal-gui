import { Component, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';

import * as fromStore from '../../store';
import { OauthService } from '../../services';

/**
 * This component is a temporary landing page for the redirect url from the authorization
 * code request. It validates the state parameter with the previous state and continues
 * to perform the code exchange if they match.
 */
@Component({
  selector: 'app-oauth-callback-page',
  template: ''
})
export class OauthCallbackPageComponent implements OnDestroy {

  private _onDestroy = new Subject<void>();

  constructor(
    private store: Store<fromStore.AuthState>,
    private oauthService: OauthService
  ) {
    this.store
      .pipe(
        select(fromStore.getCallbackState),
        takeUntil(this._onDestroy),
        take(1),
      )
      .subscribe(({ code, state, prevState }) => {
        const { nextUrl, authorizationState } = this.oauthService.parseCallbackState(state);

        if (authorizationState === prevState) {
          this.store.dispatch(new fromStore.AuthorizeCallback());
          this.store.dispatch(new fromStore.CodeExchange({ code, nextUrl }));
        } else {
          const error = Error('State parameters do not match');
          this.store.dispatch(new fromStore.AuthorizeCallbackFail(error));
        }
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
