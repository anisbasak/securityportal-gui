import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

/**
 * Wraps a mat-table to show a shade, spinner, and empty message.
 *
 * ```
 * <sat-table-loader>
 *  <mat-table></mat-table>
 *  <sat-table-empty>Empty</sat-table-empty>
 * </sat-table-loader>
 * ```
 */
@Component({
  selector: 'sat-table-loader',
  styleUrls: ['./table-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'sat-table-loader',
    '[class.sat-table-loading]': 'loading'
  },
  template: `
    <!-- Shade to overlay table while results are loading -->
    <div class="sat-table-loader-shade" *ngIf="loading">
      <mat-spinner [color]="color" [strokeWidth]="4" [diameter]="40"></mat-spinner>
    </div>

    <!-- This is where the user should put their table, pagination, filter-->
    <ng-content></ng-content>

    <!-- Message to show when no results are available -->
    <ng-content select="sat-table-empty" *ngIf="empty"></ng-content>
  `
})
export class SatTableLoaderComponent {

  /** Whether data is currently loading */
  @Input() loading: boolean;

  /** Whether no results are available */
  @Input() empty = false;

  /** Color for the spinner */
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
}


/**
 * Used to show a message whenever the no results are available.
 */
@Component({
  selector: 'sat-table-empty',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'sat-table-empty' },
  template: '<ng-content></ng-content>'
})
export class SatTableEmptyComponent { }
