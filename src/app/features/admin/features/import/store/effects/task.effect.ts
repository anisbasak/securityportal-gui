import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import * as taskActions from '../actions/task.action';
import * as fromServices from '../../services';

@Injectable()
export class TaskEffects {

  constructor(
    private action$: Actions,
    private importService: fromServices.ImportService,
  ) {}

  @Effect()
  loadTasks$ = this.action$.pipe(
    ofType(taskActions.LOAD_TASKS),
    switchMap(() => {
      return this.importService.getTasks().pipe(
        map(tasks => new taskActions.LoadTasksSuccess(tasks)),
        catchError(error => of(new taskActions.LoadTasksFail(error))),
      );
    })
  );
}
