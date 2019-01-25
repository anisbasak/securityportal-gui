import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromModels from '../../models';
import * as fromConstants from '../../constants';

interface BlueprintResponse {
  blueprints: fromModels.Blueprints;
}

const RULES_ENDPOINT = `${fromConstants.API_ROOT}/core/rules`;

/**
 * Handles all API requests for (generally) static rule sets.
 */
@Injectable()
export class RulesApiService {

  constructor(private http: HttpClient) {}

  getBlueprints(): Observable<fromModels.Blueprints> {
    const path = `${RULES_ENDPOINT}/blueprint`;
    return this.http
      .get<fromModels.ApiResponse<BlueprintResponse>>(path)
      .pipe(map(res => res.data.blueprints));
  }

}
