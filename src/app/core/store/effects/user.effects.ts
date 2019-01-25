import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import * as userActions from '../actions/user.action';
import * as fromServices from '../../services';

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private userService: fromServices.UserService,
  ) {}

  @Effect()
  loadUser$ = this.actions$.pipe(
    ofType(userActions.LOAD_USER),
    switchMap(() => {
      return this.userService.getUser()
        .pipe(
          map(payload => new userActions.LoadUserSuccess(payload)),
          catchError(error => of(new userActions.LoadUserFail(error))),
        );
    }),
  );

  @Effect()
  loadProfileUser$ = this.actions$.pipe(
    ofType(userActions.LOAD_PROFILE_USER),
    switchMap(() => {
      return this.userService.getProfile()
        .pipe(
          map(profile => new userActions.LoadProfileUserSuccess(profile)),
          catchError(error => of(new userActions.LoadProfileUserFail(error))),
        );
    }),
  );
}
