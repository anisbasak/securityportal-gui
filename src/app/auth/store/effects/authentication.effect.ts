import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of, timer } from 'rxjs';
import { tap, map, switchMap, catchError, take, withLatestFrom } from 'rxjs/operators';
import * as addSeconds from 'date-fns/add_seconds';

import * as fromServices from '../../services';
import * as fromAuth from '../reducers';
import * as fromOauth from '../actions/oauth.action';
import * as fromActions from '../actions/authentication.action';
import * as fromStorage from '../storage/authentication.storage';
import * as fromSelectors from '../selectors';
import * as fromConstants from '../../constants';

@Injectable()
export class AuthenticationEffects {

  constructor(
    private store: Store<fromAuth.AuthState>,
    private actions$: Actions,
    private oauthService: fromServices.OauthService,
    private timeoutWarningService: fromServices.TimeoutWarningService,
  ) {}

  /** After the given delay get token info. */
  @Effect()
  confirmToken$ = this.actions$.pipe(
    ofType(fromActions.CONFIRM_TOKEN),
    switchMap((action: fromActions.ConfirmToken) => {
      const { delayMs } = action.payload;
      return timer(delayMs);
    }),
    map(() => new fromActions.TokenInfo()),
  );

  /** Save a token in persistent storage. */
  @Effect({ dispatch: false })
  storeToken$ = this.actions$.pipe(
    ofType(fromActions.STORE_TOKEN),
    tap((action: fromActions.StoreToken) => fromStorage.set(action.payload))
  );

  @Effect()
  revokeToken$ = this.actions$.pipe(
    ofType(fromActions.REVOKE_TOKEN),
    switchMap(() => this.store.pipe(select(fromSelectors.getToken), take(1))),
    switchMap(token => {
      return this.oauthService.revokeToken(token)
        .pipe(
          map(() => new fromActions.RevokeTokenSuccess()),
          catchError(error => of(new fromActions.RevokeTokenFail(error))),
        );
    }),
  );

  @Effect()
  extendToken$ = this.actions$.pipe(
    ofType(fromActions.EXTEND_TOKEN),
    switchMap(() => this.store.pipe(select(fromSelectors.getToken), take(1))),
    switchMap(token => {
      return this.oauthService.extendToken(token)
        .pipe(
          map(info => new fromActions.ExtendTokenSuccess(info)),
          catchError(error => of(new fromActions.RevokeTokenFail(error))),
        );
    }),
  );

  @Effect()
  tokenInfo$ = this.actions$.pipe(
    ofType(fromActions.TOKEN_INFO),
    switchMap(() => this.store.pipe(select(fromSelectors.getToken), take(1))),
    switchMap(token => {
      return this.oauthService.getTokenInfo(token)
        .pipe(
          map(info => new fromActions.TokenInfoSuccess(info)),
          catchError(error => of(new fromActions.TokenInfoFail(error))),
        );
    }),
  );

  /**
   * Whenever token info has been received, either by direct request or as the
   * result of a token extension, use the expiration information to show a warning,
   * reconfirm at a later date, or sign out.
   */
  @Effect()
  handleTokenInfoSuccess$ = this.actions$.pipe(
    ofType(fromActions.TOKEN_INFO_SUCCESS, fromActions.EXTEND_TOKEN_SUCCESS),
    withLatestFrom(this.store.pipe(select(fromSelectors.getToken))),
    map(([action, token]: [fromActions.TokenInfoSuccess | fromActions.ExtendTokenSuccess, string]) => {
      const { expires_in } = action.payload;

      // If the token is discovered to have expired, remove it and sign out.
      if (expires_in <= 0) {
        // TODO: display message 'Your session has expired. Please sign in again.'
        return this._clearTokenAndSignOut();
      }

      if (expires_in <= fromConstants.TOKEN_WARNING_TIME_SECONDS) {
        // Show a warning to the user and allow them to extend their token expiration
        const expiration = addSeconds(new Date(), expires_in);
        this.store.dispatch(new fromActions.ShowTokenWarning({ expiration }));

        // Re-confirm the token when it is supposed to expire so that the user will
        // be signed-out if they do not extend the expiration
        this.store.dispatch(new fromActions.ConfirmToken({ delayMs: expires_in * 1000 }));
      } else {
        // Confirm the token again later
        const delaySeconds = expires_in - fromConstants.TOKEN_WARNING_TIME_SECONDS;
        this.store.dispatch(new fromActions.ConfirmToken({ delayMs: delaySeconds * 1000 }));
      }

      // Store the token
      return new fromActions.StoreToken({ token });
    }),
  );

  /**
   * Redirect to the home page once the token is successfully revoked.
   */
  @Effect()
  handleRevokeSuccess$ = this.actions$.pipe(
    ofType(fromActions.REVOKE_TOKEN_SUCCESS),
    map(() => this._clearTokenAndSignOut()),
  );

  /**
   * Using the warning service, display a token warning to the user. Use
   * the result of their selection to either extend the token expiration
   * or sign them out.
   */
  @Effect()
  handleShowTokenWarning$ = this.actions$.pipe(
    ofType(fromActions.SHOW_TOKEN_WARNING),
    switchMap((action: fromActions.ShowTokenWarning) => {
      const { expiration } = action.payload;
      return this.timeoutWarningService.showWarning(expiration);
    }),
    map(extendToken => {
      return extendToken ? new fromActions.ExtendToken() : this._clearTokenAndSignOut();
    }),
  );

  /**
   * Remove the token from storage and re-authorize.
   */
  private _clearTokenAndSignOut(nextUrl = '') {
    fromStorage.remove();
    const authorizationState = this.oauthService.createRandomState();
    return new fromOauth.Authorize({ nextUrl, authorizationState });
  }

}
