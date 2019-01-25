import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, take, tap } from 'rxjs/operators';

import * as apiActions from '../actions/api.action';
import * as fromReducers from '../reducers';
import * as fromSelectors from '../selectors';
import * as fromServices from '../../services';

@Injectable()
export class ApiEffects {

  constructor(
    private action$: Actions,
    private store: Store<fromReducers.CoreState>,
    private coreApiService: fromServices.CoreApiService,
    private titleService: Title,
  ) {}

  @Effect()
  loadOptions$ = this.action$.pipe(
    ofType(apiActions.LOAD_API_OPTIONS),
    switchMap(() => {
      return this.coreApiService.getOptions().pipe(
        map(options => new apiActions.LoadApiOptionsSuccess(options)),
        catchError(error => of(new apiActions.LoadApiOptionsFail(error)))
      );
    })
  );

  @Effect()
  loadVersion$ = this.action$.pipe(
    ofType(apiActions.LOAD_API_VERSION),
    switchMap(() => {
      return this.coreApiService.getVersion().pipe(
        map(version => new apiActions.LoadApiVersionSuccess(version)),
        catchError(error => of(new apiActions.LoadApiVersionFail(error))),
      );
    })
  );

  @Effect({ dispatch: false })
  siteTitle$ = this.action$.pipe(
    ofType(apiActions.LOAD_API_OPTIONS_SUCCESS),
    switchMap(() => this.store.pipe(select(fromSelectors.getFullSiteTitle), take(1))),
    tap(title => this.titleService.setTitle(title))
  );
}
