import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';

import * as fromModels from '../../models';

@Component({
  selector: 'app-tasks-table',
  styleUrls: ['./tasks-table.component.scss'],
  template: `
    <h3>Tasks:</h3>
    <div class="table-container mat-elevation-z2">
      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Name </th>
          <td mat-cell *matCellDef="let task"> {{ task.origin.name }} </td>
        </ng-container>

        <ng-container matColumnDef="instance">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Instance </th>
          <td mat-cell *matCellDef="let task"> {{ task.origin.instance }} </td>
        </ng-container>

        <ng-container matColumnDef="label">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Label </th>
          <td mat-cell *matCellDef="let task"> {{ task.origin.label }} </td>
        </ng-container>

        <ng-container matColumnDef="state">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> State </th>
          <td mat-cell *matCellDef="let task"> {{ task.state }} </td>
        </ng-container>

        <ng-container matColumnDef="progress">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Progress </th>
          <td mat-cell
            class="stats-cell"
            *matCellDef="let task"
            [satPopoverAnchorFor]="p"
            (click)="p.open()">
            {{ task.stats.percentComplete | percent }}
            <sat-popover #p hasBackdrop yAlign="end">
              <app-task-stats [task]="task"></app-task-stats>
            </sat-popover>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>
  `
})
export class ImportTasksTableComponent implements OnInit {
  @Input() tasks: fromModels.Task[];
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['name', 'instance', 'label', 'state', 'progress'];
  dataSource: MatTableDataSource<fromModels.Task>;

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.tasks);
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = taskAccessor;
  }

}

function taskAccessor(task: fromModels.Task, sortHeaderId: string): string | number  {
  switch (sortHeaderId) {
    case 'instance':
      return task.origin.instance;
    case 'label':
      return task.origin.label;
    case 'progress':
      return task.stats.percentComplete;

    default:
      return task[sortHeaderId];
  }
}
