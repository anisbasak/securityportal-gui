import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import * as scheduleActions from '../actions/schedule.action';
import * as fromServices from '../../services';

@Injectable()
export class ScheduleEffects {

  constructor(
    private action$: Actions,
    private importService: fromServices.ImportService,
  ) {}

  @Effect()
  loadSchedules$ = this.action$.pipe(
    ofType(scheduleActions.LOAD_SCHEDULES),
    switchMap(() => {
      return this.importService.getSchedules().pipe(
        map(schedules => new scheduleActions.LoadSchedulesSuccess(schedules)),
        catchError(error => of(new scheduleActions.LoadSchedulesFail(error))),
      );
    })
  );
}
