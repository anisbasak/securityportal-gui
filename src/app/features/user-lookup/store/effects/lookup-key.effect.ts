import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import * as lookupKeyActions from '../actions/lookup-key.action';
import * as fromServices from '../../services';

@Injectable()
export class LookupKeysEffects {

  constructor(
    private action$: Actions,
    private userLookupService: fromServices.UserLookupService
  ) {}

  @Effect()
  loadLookupKeys$ = this.action$.pipe(
    ofType(lookupKeyActions.LOAD_LOOKUP_KEYS),
    switchMap(() => {
      return this.userLookupService.getLookupKeys().pipe(
        map(keys => new lookupKeyActions.LoadLookupKeysSuccess(keys)),
        catchError(error => of(new lookupKeyActions.LoadLookupKeysFail(error))),
      );
    })
  );
}
