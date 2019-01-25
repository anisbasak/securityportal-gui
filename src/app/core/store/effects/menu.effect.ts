import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import * as menuActions from '../actions/menu.action';
import * as fromServices from '../../services';

@Injectable()
export class MenuEffects {

  constructor(
    private actions$: Actions,
    private menuService: fromServices.MenuService,
  ) {}

  @Effect()
  loadMenu$ = this.actions$.pipe(
    ofType(menuActions.LOAD_MENU),
    switchMap(() => {
      return this.menuService.getMenu().pipe(
        map(menu => new menuActions.LoadMenuSuccess(menu)),
        catchError(error => of(new menuActions.LoadMenuFail(error)))
      );
    })
  );

}
