
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap, map, shareReplay, tap, filter, take } from 'rxjs/operators';
import _find from 'lodash-es/find';

import * as fromCore from '@app/core/store';
import * as fromConstants from '@app/core/constants';
import { ApiResponse, Blueprint, Blueprints, Resource } from '@app/core/models';

@Injectable()
export class ResourceService {

  /** Observable for getting a list of blueprints */
  private blueprints$: Observable<Blueprints>;

  constructor(
    private http: HttpClient,
    private store: Store<fromCore.CoreState>,
  ) {
    this.blueprints$ = this.store.pipe(
      select(fromCore.getBlueprintsLoaded),
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromCore.LoadBlueprints());
        }
      }),
      filter(loaded => loaded),
      take(1),
      switchMap(() => this.store.pipe(select(fromCore.getAllBlueprints))),
      shareReplay(1),
    );
  }

  /** Get a list of blueprints. */
  getBlueprints(): Observable<Blueprints> {
    return this.blueprints$;
  }

  /** Get a single blueprint. */
  getBlueprint(name: string): Observable<Blueprint> {
    return this.getBlueprints().pipe(map(blueprints => blueprints.find(b => b.name === name)));
  }

  /** Find a resource based on its object id */
  getResource(id: string): Observable<Resource> {
    if (!id) { throw new Error('No id provided'); }

    return this.http.get<ApiResponse>(`${fromConstants.API_ROOT}/core/resource/fetch/${id}`)
      .pipe(map(res => res.data.resource));
  }
}
