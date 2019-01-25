import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromConstants from '../../constants';
import * as fromRoot from '../../../store';
import * as fromServices from '../../services';
import * as fromActions from '../actions/oauth.action';
import * as fromAuthenticationActions from '../actions/authentication.action';
import * as fromSelectors from '../selectors';
import * as fromAuth from '../reducers';
import * as fromStorage from '../storage/oauth.storage';

@Injectable()
export class OauthEffects {
  constructor(
    private store: Store<fromAuth.AuthState>,
    private actions$: Actions,
    private oauthService: fromServices.OauthService,
  ) {}

  /** Initialize the oauth flow. */
  @Effect()
  authorization$ = this.actions$.pipe(
    ofType<fromActions.Authorize>(fromActions.AUTHORIZE),
    withLatestFrom(this.store.pipe(select(fromSelectors.getOauthState))),
    map(([action, state]) => {
      const { nextUrl, authorizationState } = action.payload;
      const location = this.oauthService.getAuthorizationUrl(nextUrl, authorizationState);

      // Store the current state before leaving so it can later be rehydrated
      // into initial state for this slice of the store. Doing so allows us to validate
      // the state key and maintain other progress-indicating state values.
      fromStorage.set(state);
      return new fromRoot.Leave({ location });
    })
  );

  /** Exchange an auth code for an access token. */
  @Effect()
  exchangeCode$ = this.actions$.pipe(
    ofType(fromActions.CODE_EXCHANGE),
    switchMap((action: fromActions.CodeExchange) => {
      const { code, nextUrl } = action.payload;
      return this.oauthService.exchangeCode(code)
        .pipe(
          map(response => new fromActions.CodeExchangeSuccess({ response, nextUrl })),
          catchError(error => of(new fromActions.CodeExchangeFail(error))),
        );
    })
  );

  /**
   * Store the token from a successful exchange. Reconfirm it at a later date,
   * just prior to its expiration.
   */
  @Effect()
  handleExchangeCodeSuccess$ = this.actions$.pipe(
    ofType(fromActions.CODE_EXCHANGE_SUCCESS),
    map((action: fromActions.CodeExchangeSuccess) => {
      const { access_token: token, expires_in } = action.payload.response;
      const { nextUrl } = action.payload;
      const nextExpirationCheckMs = 1000 * (expires_in - fromConstants.TOKEN_WARNING_TIME_SECONDS);

      return { nextUrl, token, nextExpirationCheckMs };
    }),
    switchMap(({ nextUrl, token, nextExpirationCheckMs }) =>  [
      new fromAuthenticationActions.ConfirmToken({ delayMs: nextExpirationCheckMs }),
      new fromAuthenticationActions.StoreToken({ token }),
      new fromRoot.Go({ path: [nextUrl] }),
    ])
  );

  /** Attempt to reauthenticate if there is a failure. */
  @Effect()
  handleFail$ = this.actions$.pipe(
    ofType(fromActions.AUTHORIZE_CALLBACK_FAIL, fromActions.CODE_EXCHANGE_FAIL),
    map(() => {
      const authorizationState = this.oauthService.createRandomState();
      return new fromActions.Authorize({ nextUrl: '', authorizationState });
    })
  );
}
