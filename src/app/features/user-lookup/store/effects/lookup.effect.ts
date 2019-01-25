import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, take, map, catchError, withLatestFrom, filter } from 'rxjs/operators';

import * as lookupActions from '../actions/lookup.action';
import * as fromReducers from '../reducers';
import * as fromSelectors from '../selectors';
import * as fromServices from '../../services';

@Injectable()
export class LookupEffects {

  constructor(
    private actions$: Actions,
    private store: Store<fromReducers.UserLookupState>,
    private userLookupService: fromServices.UserLookupService
  ) {}

  @Effect()
  lookup$ = this.actions$.pipe(
    ofType(lookupActions.LOOKUP),
    switchMap(() => this.store.pipe(select(fromSelectors.getFormState), take(1))),
    switchMap(value => {
      return this.userLookupService.submitForm(value).pipe(
        map(response => new lookupActions.LookupSuccess(response)),
        catchError(error => of(new lookupActions.LookupFail(error))),
      );
    })
  );

  @Effect()
  previewUser$ = this.actions$.pipe(
    ofType(lookupActions.PREVIEW_USER),
    map((action: lookupActions.PreviewUser) => action.payload.id),
    withLatestFrom(this.store.pipe(select(fromSelectors.getUserEntities))),
    filter(([id, userEntities]) => !userEntities[id]),
    map(([id]) => new lookupActions.LoadUser({ id })),
  );

  @Effect()
  loadUser$ = this.actions$.pipe(
    ofType(lookupActions.LOAD_USER),
    switchMap((action: lookupActions.LoadUser) => {
      return this.userLookupService.loadUser(action.payload.id).pipe(
        map(user => new lookupActions.LoadUserSuccess(user)),
        catchError(error => of(new lookupActions.LoadUserFail(error))),
      );
    })
  );
}
