import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import * as fromServices from '../services';
import * as fromStore from '../store';

const LOADER_DELAY_MS = 500;

/**
 * Http interceptor that starts and completes loading indicators for all ajax requests.
 * When a request is started, an action dispatches with a constant 'expiration delay. If
 * the request takes longer than the delay, then a loader will display.
 */
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(
    private store: Store<fromStore.CoreState>,
    private loadingService: fromServices.LoadingService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const id = this.loadingService.getNextId();

    this.store.dispatch(new fromStore.LoadingStart({
      id,
      delay: LOADER_DELAY_MS,
      data: `ajax: ${request.url}`
    }));

    // Note: we must wrap the return in another Observable to handle cancelled requests.
    // Angular/Http does not emit an event for cancelled requests, so we must monitor
    // when the return is unsubscribed and dispatch the complete event then.
    return new Observable(observer => {
      const subscription = next.handle(request)
        .pipe(
          tap(event => {
            if (event instanceof HttpResponse) {
              this.store.dispatch(new fromStore.LoadingComplete({ id }));
            }
          }),
          catchError(err => {
            if (err instanceof HttpErrorResponse) {
              this.store.dispatch(new fromStore.LoadingComplete({ id }));
            }
            return throwError(err);
          })
        )
        .subscribe(
          event => observer.next(event),
          err => observer.error(err),
        );

      return () => {
        // Complete canclled requests
        if (!subscription.closed) {
          this.store.dispatch(new fromStore.LoadingComplete({ id }));
          subscription.unsubscribe();
        }
      };
    });
  }
}
