import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as fromModels from '../../models';
import * as fromConstants from '../../constants';

interface RouteAccessResponse {
  access: boolean;
}

@Injectable()
export class RouteAccessService {

  constructor(private http: HttpClient) {}

  getRouteAccess(route: string): Observable<boolean> {
    const params = { route };
    const path = `${fromConstants.API_ROOT}/gui/route-access`;
    return this.http
      .get<fromModels.ApiResponse<RouteAccessResponse>>(path, { params })
      .pipe(
        map(res => res.data.access),
        catchError(() => of(false)),
      );
  }
}
