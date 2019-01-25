import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromModels from '../../models';
import * as fromConstants from '../../constants';

interface MeResponse {
  me: fromModels.CoreUser;
}

interface ProfileResponse {
  profile: fromModels.ProfileUser;
}

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {}

  getUser(): Observable<fromModels.CoreUser> {
    return this.http
      .get<fromModels.ApiResponse<MeResponse>>(`${fromConstants.API_ROOT}/core/me`)
      .pipe(map(res => res.data.me));
  }

  getProfile(): Observable<fromModels.ProfileUser> {
    return this.http
      .get<fromModels.ApiResponse<ProfileResponse>>(`${fromConstants.API_ROOT}/gui/profile`)
      .pipe(map(res => res.data.profile));
  }
}
