import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, switchMap, tap, filter } from 'rxjs/operators';

import * as fromRoot from '@app/store';
import * as fromStore from '../store';

@Injectable()
export class LookupResultsLoadedGuard implements CanActivate {
  constructor(private store: Store<fromStore.UserLookupState>) {}

  /**
   * Activate if results are loaded as a result of a lookup. If results
   * are not loaded, redirect to lookup page.
   */
  canActivate(): Observable<boolean> {
    return this.getLoadedWhenLoadingComplete()
      .pipe(
        tap(resultsLoaded => {
          if (!resultsLoaded) {
            this.store.dispatch(new fromRoot.Go({ path: ['user-lookup'] }));
          }
        })
      );
    }

  /**
   * Return the latest value of `resultsLoaded` as soon as `resultsLoading`
   * is false.
   */
  getLoadedWhenLoadingComplete(): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.getLookupResultsLoading),
      filter(loading => !loading),
      switchMap(() => this.store.pipe(select(fromStore.getLookupResultsLoaded))),
      take(1),
    );
  }

}
