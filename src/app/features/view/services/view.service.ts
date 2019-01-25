import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromConstants from '@app/core/constants';
import * as fromCoreModels from '@app/core/models';
import * as fromModels from '../models';

interface ViewableResourceResponse {
  resource: fromModels.ViewableResource;
}

@Injectable()
export class ViewService {
  constructor(private http: HttpClient) {}

  loadResource(id: string): Observable<fromModels.ViewableResource> {
    const path = `${fromConstants.API_ROOT}/search/view/${id}`;
    return this.http
      .get<fromCoreModels.ApiResponse<ViewableResourceResponse>>(path)
      .pipe(map(res => res.data.resource));
  }
}
