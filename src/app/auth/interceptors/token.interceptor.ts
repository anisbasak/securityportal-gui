import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';

import { Store, select } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { switchMap, take, map, catchError, filter, elementAt } from 'rxjs/operators';

import * as services from '../services';
import * as fromStore from '../store';

/**
 * Apply the authorization-bearer header to all requests when authenticated. If the request,
 * errors as Unauthorized, trigger the authorization transaction or wait for a current
 * transaction to complete before retrying the request.
 *
 * TODO: only apply to requests that require it to avoid exposing token
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private store: Store<fromStore.AuthState>,
    private oauthService: services.OauthService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.addToken(request)
      .pipe(
        switchMap(req => next.handle(req)),
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.handleUnauthorizedError(error, request, next);
          }

          return throwError(error);
        })
      );
  }

  /** Return a new request object with the current access token applied in the header. */
  private addToken(request: HttpRequest<any>): Observable<HttpRequest<any>> {
    return this.store.pipe(
      select(fromStore.getToken),
      take(1),
      map(token => {
        if (token) {
          return request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
        } else {
          return request;
        }
      }),
    );
  }

  /**
   * If the application is currently exchanging codes, wait for that to complete and retry
   * the request with the new token. Otherwise, dispatch an authorization action to start
   * a new auth transaction.
   */
  private handleUnauthorizedError(error: Error, request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store
      .pipe(
        select(fromStore.getExchanging),
        take(1),
        switchMap(exchanging => {
          if (exchanging) {
            return this.retryRequestAfterExchange(request, next);
          } else {
            const authorizationState = this.oauthService.createRandomState();
            this.store.dispatch(new fromStore.Authorize({ nextUrl: '', authorizationState }));
            return throwError(error);
          }
        }),
      );
  }

  private retryRequestAfterExchange(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.pipe(
      select(fromStore.getExchanged),
      filter(exchanged => exchanged),
      take(1),
      // Note: this is weird, I know. The 'exchanged' emission will precede the new token being
      // set in the state, so we need to wait until the _second token_ is available. The first
      // will be the old one and will simply cause another failed request if used.
      switchMap(() => this.store.pipe(select(fromStore.getToken), elementAt(1))),
      switchMap(() => this.addToken(request)),
      switchMap(req => next.handle(req)),
    );
  }

}
