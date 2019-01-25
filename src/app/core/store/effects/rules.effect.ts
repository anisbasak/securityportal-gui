import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import * as rulesActions from '../actions/rules.action';
import * as fromServices from '../../services';

@Injectable()
export class RulesEffects {

  constructor(
    private actions$: Actions,
    private rulesService: fromServices.RulesApiService,
  ) {}

  @Effect()
  loadBlueprints$ = this.actions$.pipe(
    ofType(rulesActions.LOAD_BLUEPRINTS),
    switchMap(() => {
      return this.rulesService.getBlueprints().pipe(
        map(rules => new rulesActions.LoadBlueprintsSuccess(rules)),
        catchError(error => of(new rulesActions.LoadBlueprintsFail(error))),
      );
    })
  );

}
