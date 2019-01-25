import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as fromConstants from '../constants';
import * as fromModels from '../models';
import { map } from 'rxjs/operators';

@Injectable()
export class OauthService {

  constructor(private http: HttpClient) { }

  /** Generate a random `state` value to be used during auth session confirmation. */
  createRandomState(): string {
    return (Math.random() + 1).toString(36).substring(2);
  }

  /** Send a code exchange request to the auth server. */
  exchangeCode(code: string): Observable<fromModels.CodeExchangeResponse> {
    const body: fromModels.CodeExchangeRequest = {
      code,
      client_id: fromConstants.OAUTH_CLIENT_ID,
      grant_type: 'authorization_code',
      redirect_uri: fromConstants.OAUTH_REDIRECT_URL,
    };

    return this.http.post<fromModels.CodeExchangeResponse>(fromConstants.OAUTH_TOKEN_URL, body);
  }

  /**
   * Send a revoke token request to the auth server. Note that there
   * is no response body; a 200 response indicates a success.
   */
  revokeToken(token: string): Observable<void> {
    return this.http.post(fromConstants.OAUTH_TOKEN_REVOKE_URL, { token })
      .pipe(map(() => {}));
  }

  /** Get information about a token. */
  getTokenInfo(token: string): Observable<fromModels.TokenInfoResponse> {
    return this.http.post<fromModels.TokenInfoResponse>(
      fromConstants.OAUTH_TOKEN_INFO_URL,
      { token },
    );
  }

  /** Manually extend a token's expiration date. */
  extendToken(token: string): Observable<fromModels.ExtendTokenResponse> {
    return this.http.post<fromModels.ExtendTokenResponse>(
      fromConstants.OAUTH_TOKEN_EXTEND_URL,
      { token },
    );
  }

  /** Generate the authorization URL that will be used to start the OAuth flow. */
  getAuthorizationUrl(nextUrl: string, authorizationState: string): string {
    // Combine the nextUrl and authorizationState into a single state param.
    // The nextUrl will be used to redirect the user once the exchange is complete.
    // The authorizationState is used to validate a single session.
    const state = this._encodeState({ nextUrl, authorizationState });

    const query = {
      response_type: 'code',
      client_id: fromConstants.OAUTH_CLIENT_ID,
      redirect_uri: fromConstants.OAUTH_REDIRECT_URL,
      state,
    };

    return `${fromConstants.OAUTH_AUTHORIZE_URL}?${this._encodeQuery(query)}`;
  }

  /** Decode the callback state param into its original form. */
  parseCallbackState(state: string): fromModels.AuthorizationStateParameter {
    return this._decodeState(state);
  }

  private _encodeState(state: fromModels.AuthorizationStateParameter): string {
    return encodeURI(JSON.stringify(state));
  }

  private _decodeState(state: string): fromModels.AuthorizationStateParameter {
    return JSON.parse(decodeURI(state));
  }

  private _encodeQuery(queryObj): string {
    const queryStrings = Object.entries(queryObj).map(([key, value]) => `${key}=${value}`);
    return encodeURI(queryStrings.join('&'));
  }
}
