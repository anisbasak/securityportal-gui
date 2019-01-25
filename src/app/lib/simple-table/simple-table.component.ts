import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { map } from 'rxjs/operators';

import { SimpleDataSource } from './simple-data-source';
import { SimpleDataStore } from './simple-data-store';
import { SatSimpleColumn } from './column.model';

interface SimpleColumnDefinition<T> {
  columnDef: string;
  header: string;
  cell: (row: T) => any;
}

@Component({
  selector: 'sat-simple-table',
  styleUrls: ['./simple-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sat-table-loader [loading]="_dataLoading" [empty]="_resultsEmpty">

      <mat-table [dataSource]="_dataSource">

        <!-- Generic column definition -->
        <ng-container *ngFor="let col of _columns" [matColumnDef]="col.columnDef">
          <mat-header-cell *matHeaderCellDef>{{ col.header }}</mat-header-cell>
          <mat-cell *matCellDef="let row">{{ col.cell(row) }}</mat-cell>
        </ng-container>

        <!-- Row definitions -->
        <mat-header-row *matHeaderRowDef="_displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: _displayedColumns; let i=index;"
          (click)="_selectRow(i)">
        </mat-row>

      </mat-table>

      <!-- Empty message -->
      <sat-table-empty>No results</sat-table-empty>

    </sat-table-loader>
  `
})
export class SatSimpleTableComponent<I, O> {

  /** Values to display in the table. */
  @Input() set data(vals: I[]) {
    if (vals) {
      this._dataLoading = false;
      this._resultsEmpty = !vals.length;
    }

    this.dataStore.set(vals);
  }

  /** Column headers and properties. */
  @Input() set columns(cols: SatSimpleColumn[]) {
    this._columns = cols.map(c => ({
      columnDef: c.key,
      header: c.name,
      cell: (row: O) => row[c.key]
    }));

    this._displayedColumns = this._columns.map(c => c.columnDef);
  }

  /** Function to map expanded values to flattened ones. */
  @Input() flattenWith: (value: I) => O;

  /** Emits when a row selection is made. */
  @Output() selection = new EventEmitter<I>();

  /** Table source with flattend objects. */
  _dataSource: SimpleDataSource<O>;

  /** A list of column definitions to define the table. */
  _columns: SimpleColumnDefinition<O>[];

  /** A list of ordered columns to be displayed. */
  _displayedColumns: string[];

  /** Whether data is loading for the first time. */
  _dataLoading = true;

  /** Whether the results are empty. */
  _resultsEmpty = false;

  /** Storage mechanism for raw inputs. */
  private dataStore = new SimpleDataStore<I>();

  constructor() {
    // Map expanded data store emissions to flattend ones and send that
    // stream to a new data source
    this._dataSource = new SimpleDataSource(
      this.dataStore.data.pipe(map(values => this.flattenValues(values)))
    );
  }

  /** Re-emit the last value set in the data store. */
  refresh(): void {
    this.dataStore.set(this.dataStore.value);
  }

  /** Emit selection event for the expanded object. */
  _selectRow(index: number) {
    this.selection.next(this.dataStore.value[index]);
  }

  /** Map expanded values to flattened ones. */
  private flattenValues(expanded: I[]): O[] {
    return expanded.map(v => this.flattenWith(v));
  }
}
