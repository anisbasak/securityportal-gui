import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Resources } from '@app/core/models';

@Injectable()
export class UserSearchService {
  search(term: string): Observable<Resources> {
    // TODO: fill this out once there is an appropriate
    // api endpoint for it
    return of([]);
  }
}
