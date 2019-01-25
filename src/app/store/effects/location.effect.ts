import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs/operators';

import * as fromReducers from '../reducers';
import * as locationActions from '../actions/location.action';

@Injectable()
export class LocationEffects {
  constructor(
    private store: Store<fromReducers.State>,
    private actions$: Actions,
  ) { }

  @Effect({ dispatch: false })
  leave$ = this.actions$.pipe(
    ofType<locationActions.Leave>(locationActions.LEAVE),
    withLatestFrom(this.store),
    tap(([action, state]) => {
      const { location } = action.payload;
      window.location.href = location;
    })
  );

}
