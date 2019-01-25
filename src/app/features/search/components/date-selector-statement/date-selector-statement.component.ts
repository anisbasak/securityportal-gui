import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { isMobile } from '@app/shared';

@Component({
  selector: 'date-selector-statement',
  styleUrls: ['./date-selector-statement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container [formGroup]="parent">

      <!-- Trait select -->
      <mat-form-field>
        <mat-select formControlName="trait" placeholder="Key">
          <mat-option *ngFor="let trait of traits" [value]="trait.key">{{ trait.rule }}</mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Begin Date -->
      <mat-form-field>
        <input matInput formControlName="begin" placeholder="From"
          [matDatepicker]="beginDatepicker">
        <mat-datepicker-toggle matSuffix [for]="beginDatepicker"></mat-datepicker-toggle>
        <mat-error>Date is required</mat-error>
      </mat-form-field>
      <mat-datepicker #beginDatepicker [touchUi]="useTouch"></mat-datepicker>

      <!-- End date -->
      <mat-form-field class="optional-input" [class.empty]="!parent.get('end').value">
        <input matInput formControlName="end" placeholder="Through (optional)"
          [matDatepicker]="endDatepicker">
        <mat-datepicker-toggle matSuffix [for]="endDatepicker"></mat-datepicker-toggle>
      </mat-form-field>
      <mat-datepicker #endDatepicker [touchUi]="useTouch"></mat-datepicker>

    </ng-container>

    <!-- Remove button -->
    <button mat-icon-button
      type="button"
      class="remove-button"
      title="Remove statement"
      color="primary"
      (click)="remove.emit()">
      <mat-icon>close</mat-icon>
    </button>
  `
})
export class DateSelectorStatementComponent {

  /** Parent form group. */
  @Input() parent: FormGroup;

  /** Traits to show in the select. */
  @Input() traits: { rule: string, key: string }[];

  /** Emits when the statement should be removed from the clause. */
  @Output() remove = new EventEmitter<void>();

  /** Whether calendar datepickers should use touch UI. */
  get useTouch() {
    return isMobile();
  }

}
