import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromConstants from '@app/core/constants';
import * as fromCoreModels from '@app/core/models';
import * as fromModels from '../models';

interface UserDetailResponse {
  user: fromModels.User;
}

@Injectable()
export class UserLookupService {

  constructor(private http: HttpClient) {}

  getLookupKeys(): Observable<fromModels.LookupKeysResponse> {
    const path = `${fromConstants.API_ROOT}/user-lookup/keys`;
    return this.http
      .get<fromCoreModels.ApiResponse<fromModels.LookupKeysResponse>>(path)
      .pipe(map(res => res.data));
  }

  submitForm(value: fromModels.UserLookupFormState): Observable<fromModels.LookupResults> {
    const newValue = filterForm(value);
    const path = `${fromConstants.API_ROOT}/user-lookup/search`;

    return this.http
      .post<fromCoreModels.ApiResponse<fromModels.LookupResults>>(path, newValue)
      .pipe(map(res => res.data));
  }

  loadUser(id: string): Observable<fromModels.User> {
    const path = `${fromConstants.API_ROOT}/user-lookup/user-patch/${id}`;
    return this.http
      .get<fromCoreModels.ApiResponse<UserDetailResponse>>(path)
      .pipe(map(res => res.data.user));
  }

}

function filterForm(value: fromModels.UserLookupFormState): fromModels.UserLookupFormState {
  const { user, link, general } = value;
  const newUser = filterEmptyValues(user);

  const newForm: fromModels.UserLookupFormState = { user: newUser };

  if (general) {
    // Wrap search term in quotes to ensure results match on the full phrase.
    // Only do this if the original search does not already contain quotes.
    newForm.general = general.includes('"') ? general : `"${general}"`;
  }

  if (link) {
    const { blueprint, keys } = link;
    const newLinkKeys = filterEmptyValues(keys);
    newForm.link = { blueprint, keys: newLinkKeys };
  }

  return newForm;
}

function filterEmptyValues(fieldMap: fromModels.LookupFieldMap): fromModels.LookupFieldMap {
  return Object.keys(fieldMap).reduce((accum, curr) => {
    const field = fieldMap[curr];

    if (field.value != null) {
      return { ...accum, [curr]: field };
    }

    return accum;
  }, {} as fromModels.LookupFieldMap);
}
