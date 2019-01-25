import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, tap, filter, take } from 'rxjs/operators';

import * as fromStore from '../store';

@Injectable()
export class LookupKeyGuard implements CanActivate {
  constructor(private store: Store<fromStore.UserLookupState>) {}

  canActivate(): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false)),
    );
  }

  checkStore(): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.getLookupKeysLoaded),
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadLookupKeys());
        }
      }),
      filter(loaded => loaded),
      take(1),
    );
  }

}
