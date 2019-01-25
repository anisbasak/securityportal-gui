import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '../../store';
import * as fromModels from '../../models';


import * as fromCore from '@app/core/store';

@Component({
  selector: 'app-import-overview-page',
  template: `
    <app-schedules-table [schedules]="schedules$ | async"></app-schedules-table>
    <app-tasks-table [tasks]="tasks$ | async"></app-tasks-table>
  `
})
export class ImportOverviewPageComponent implements OnInit {

  schedules$: Observable<fromModels.Schedule[]>;
  tasks$: Observable<fromModels.Task[]>;

  constructor(private store: Store<fromCore.CoreState>) {}

  ngOnInit() {
    this.store.dispatch(new fromCore.SetFeatureTitle({ title: 'Import' }));
    this.schedules$ = this.store.pipe(select(fromStore.getSchedules));
    this.tasks$ = this.store.pipe(select(fromStore.getTasks));
  }

}
