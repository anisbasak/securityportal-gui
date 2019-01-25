import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { map, take, filter, catchError, switchMap } from 'rxjs/operators';

import * as fromRoot from '@app/store';
import * as fromStore from '../store';

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(private store: Store<fromStore.UserLookupState>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.userId;
    return this.checkStore(id).pipe(
      switchMap(() => of(true)),
      catchError(() => {
        this.store.dispatch(new fromRoot.Go({ path: ['user-lookup'] }));
        return of(false);
      }),
    );
  }

  checkStore(id: string): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.getUserEntities),
      map(entities => !!entities[id]),
      switchMap(exists => {
        if (exists) {
          return of(true);
        }

        // Load the user if it doesn't already exist in the store. If
        // an error occurs before the user is available, throw to ensure
        // the guard fails.
        this.store.dispatch(new fromStore.LoadUser({ id }));
        return this.store.pipe(
          select(fromStore.getUserLoadingError),
          filter(err => !!err),
          switchMap(err => throwError(err))
        );
      }),
      take(1),
    );
  }

}
