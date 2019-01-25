import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromModels from '../../models';
import * as fromConstants from '../../constants';

interface MenuResponse {
  menu: fromModels.MenuObject[];
}

@Injectable()
export class MenuService {

  constructor(private http: HttpClient) {}

  getMenu(): Observable<fromModels.MenuObject[]> {
    const path = `${fromConstants.API_ROOT}/gui/menu`;
    return this.http
      .get<fromModels.ApiResponse<MenuResponse>>(path)
      .pipe(map(res => res.data.menu));
  }
}
