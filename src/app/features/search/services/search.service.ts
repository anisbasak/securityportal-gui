import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromConstants from '@app/core/constants';
import { ApiResponse, Resources } from '@app/core/models';

export interface ResourceSearchQuery {
  blueprints?: string[];
  date?: string[];
  text?: string;
  location?: any;
}

export interface ResourceSearchOptions {
  limit?: number;
  skip?: number;
}

/** Combo interface to package total count with resources. */
interface ResourcesWithTotal {
  resources: Resources;
  total?: number;
}

@Injectable()
export class SearchService {

  constructor(private http: HttpClient) { }

  /** Search for resources. */
  search(query: ResourceSearchQuery, options?: ResourceSearchOptions): Observable<Resources> {
    return this.searchTotalCount(query, options).pipe(map(x => x.resources));
  }

  /** Search for resources and include the total count. */
  searchTotalCount(query: ResourceSearchQuery, options?: ResourceSearchOptions): Observable<ResourcesWithTotal> {
    const body = {
      query: query,
      options: options || { skip: 0, limit: 25 }
    };

    return this.http.post<ApiResponse<ResourcesWithTotal>>(`${fromConstants.API_ROOT}/core/resource/search`, body)
      .pipe(
        map(res => res.data),
        map(data => ({
          resources: this.convertSearchObjectsToResources(data.resources),
          total: data.total
        })),
      );
  }

  /** Rearrange object to be resource type if special search result. */
  private convertSearchObjectsToResources(data: any[]): Resources {
    return data.map(x => {
      if (x.dis && x.obj && x.loc) {
        // Search result from "near" location search
        x.obj['distance'] = x.dis;
        return x.obj;
      }

      return x;
    });
  }

}
