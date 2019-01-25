import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromConstants from '@app/core/constants';
import * as fromCoreModels from '@app/core/models';
import * as fromModels from '../models';

interface SchedulesResponse {
  schedules: fromModels.Schedule[];
}

interface TasksResponse {
  tasks: fromModels.Task[];
}

@Injectable()
export class ImportService {

  constructor(private http: HttpClient) {}

  getSchedules(): Observable<fromModels.Schedule[]> {
    const path = `${fromConstants.API_ROOT}/import/schedules`;
    return this.http
      .get<fromCoreModels.ApiResponse<SchedulesResponse>>(path)
      .pipe(map(res => res.data.schedules));
  }

  getTasks(): Observable<fromModels.Task[]> {
    const path = `${fromConstants.API_ROOT}/import/tasks`;
    return this.http
      .get<fromCoreModels.ApiResponse<TasksResponse>>(path)
      .pipe(map(res => res.data.tasks));
  }
}
