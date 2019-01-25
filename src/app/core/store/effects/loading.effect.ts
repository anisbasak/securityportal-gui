import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, flatMap, delay, filter, map, take } from 'rxjs/operators';

import * as fromFeature from '../reducers';
import * as loadingActions from '../actions/loading.action';
import * as loadingSelectors from '../selectors/loading.selector';

@Injectable()
export class LoadingEffects {

  constructor(
    private store$: Store<fromFeature.CoreState>,
    private actions$: Actions,
  ) {}

  /**
   * Add the loading entity ID to the show loader array if it hasn't
   * been completed during the delay period.
   */
  @Effect()
  loading$ = this.actions$.pipe(
    ofType(loadingActions.LOADING_START),
    // It's important to not use switchMap here in order to not
    // cancel the delay if a new action emits during the delay.
    flatMap((action: loadingActions.LoadingStart) => {
      const { id, delay: delayMs } = action.payload;
      return this.getLoadingEntitiesAfterDelay(delayMs)
        .pipe(
          filter(entities => !!entities[id]),
          map(() => new loadingActions.ShowLoader({ id }))
        );
    }),
  );

  private getLoadingEntitiesAfterDelay(delayMs: number): Observable<{ [id: number]: number }> {
    return of(null)
      .pipe(
        delay(delayMs),
        switchMap(() => this.getLoadingEntities()),
      );
  }

  private getLoadingEntities(): Observable<{ [id: number]: number }> {
    return this.store$.pipe(select(loadingSelectors.getLoadingEntities), take(1));
  }
}
