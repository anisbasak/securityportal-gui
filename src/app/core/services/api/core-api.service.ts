import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromModels from '../../models';
import * as fromConstants from '../../constants';

interface OptionsResponse {
  options: fromModels.Resources;
}

@Injectable()
export class CoreApiService {

  constructor(private http: HttpClient) {}

  getOptions(): Observable<fromModels.Resources> {
    const path = `${fromConstants.API_ROOT}/core/server/options`;
    return this.http
      .get<fromModels.ApiResponse<OptionsResponse>>(path)
      .pipe(map(res => res.data.options));
  }

  getVersion(): Observable<fromModels.ApiVersion> {
    const path = `${fromConstants.API_ROOT}/core/server/version`;
    return this.http
      .get<fromModels.ApiResponse<fromModels.ApiVersion>>(path)
      .pipe(map(res => res.data));
  }
}
