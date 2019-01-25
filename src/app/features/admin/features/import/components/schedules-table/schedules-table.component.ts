import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';

import * as fromModels from '../../models';

@Component({
  selector: 'app-schedules-table',
  styleUrls: ['./schedules-table.component.scss'],
  template: `
    <h3>Schedules:</h3>
    <div class="table-container mat-elevation-z2">
      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Name </th>
          <td mat-cell *matCellDef="let schedule"> {{ schedule.origin.name }} </td>
        </ng-container>

        <ng-container matColumnDef="instance">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Instance </th>
          <td mat-cell *matCellDef="let schedule"> {{ schedule.origin.instance }} </td>
        </ng-container>

        <ng-container matColumnDef="label">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Label </th>
          <td mat-cell *matCellDef="let schedule"> {{ schedule.origin.label }} </td>
        </ng-container>

        <ng-container matColumnDef="enabled">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Enabled </th>
          <td mat-cell *matCellDef="let schedule"> {{ schedule.isEnabled }} </td>
        </ng-container>

        <ng-container matColumnDef="upsert">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Upsert </th>
          <td mat-cell *matCellDef="let schedule"> {{ schedule.upsert }} </td>
        </ng-container>

        <ng-container matColumnDef="removal">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Removal </th>
          <td mat-cell *matCellDef="let schedule"> {{ schedule.removal }} </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>
  `
})
export class ImportSchedulesTableComponent implements OnInit {
  @Input() schedules: fromModels.Schedule[];
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['name', 'instance', 'label', 'enabled', 'upsert', 'removal'];
  dataSource: MatTableDataSource<fromModels.Schedule>;

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.schedules);
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = scheduleAccessor;
  }

}

function scheduleAccessor(schedule: fromModels.Schedule, sortHeaderId: string): string | number  {
  switch (sortHeaderId) {
    case 'instance':
      return schedule.origin.instance;
    case 'label':
      return schedule.origin.label;
    case 'enabled':
      return schedule.isEnabled.toString();

    default:
      return schedule[sortHeaderId];
  }
}
