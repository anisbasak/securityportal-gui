import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, tap, take, filter } from 'rxjs/operators';

import * as fromStore from '../store';

@Injectable()
export class ProfileUserGuard implements CanActivate {
  constructor(private store: Store<fromStore.CoreState>) {}

  canActivate(): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false)),
    );
  }

  checkStore(): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.getProfileUserLoaded),
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadProfileUser());
        }
      }),
      filter(loaded => loaded),
      take(1),
    );
  }
}
