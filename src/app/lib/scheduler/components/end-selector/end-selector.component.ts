import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as endOfToday from 'date-fns/end_of_today';
import * as isAfter from 'date-fns/is_after';

import { isMobile } from '@app/shared';

@Component({
  selector: 'end-selector',
  styleUrls: ['./end-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="end-group" [formGroup]="parent">

      <!-- Selection -->
      <mat-form-field class="type-select">
        <mat-select formControlName="selection"
          placeholder="End">
          <mat-option value="never">Never</mat-option>
          <mat-option value="date">On a Date</mat-option>
          <mat-option value="count">After</mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Date -->
      <ng-container *ngIf="selectionControl.value === 'date'">
        <mat-form-field class="date-input">
          <input matInput formControlName="date"
            [errorStateMatcher]="dateErrorStateMatcher"
            [matDatepicker]="datepicker"
            [matDatepickerFilter]="laterThanToday">
          <mat-datepicker-toggle matSuffix [disabled]="dateControl.disabled" [for]="datepicker"></mat-datepicker-toggle>
          <mat-error>{{ dateErrorMessage() }}</mat-error>
        </mat-form-field>
        <mat-datepicker #datepicker [touchUi]="useTouch"></mat-datepicker>
      </ng-container>

      <!-- Count -->
      <mat-form-field *ngIf="selectionControl.value === 'count'">
        <input matInput formControlName="count"
          placeholder="Count"
          type="number"
          [min]="minCount"
          [max]="maxCount">
        <mat-error *ngIf="countControl.hasError('required')">Required</mat-error>
        <mat-error *ngIf="!countControl.hasError('required')">
          Min: {{ minCount }}, Max: {{ maxCount }}
        </mat-error>
      </mat-form-field>

    </div>
  `
})
export class EndSelectorComponent implements OnInit, OnDestroy {

  /** Parent form group */
  @Input() parent: FormGroup;

  /** Whether the date control has an error of being before start date */
  @Input() hasEndAfterStartError: boolean;

  /** Minimum count allowed by the input */
  @Input() minCount = 0;

  /** Maximum count allowed by the input */
  @Input() maxCount = 1000;

  /** Error state matcher for the date control. */
  dateErrorStateMatcher: ErrorStateMatcher = {
    isErrorState: (control: FormControl) => control.invalid  || this.hasEndAfterStartError
  };

  /** Subject that emits when component is destroyed */
  private destroy = new Subject<void>();

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.parent.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.cd.markForCheck());
  }

  /** Cancel subscriptions */
  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  /** Whether calendar datepickers should use touch UI */
  get useTouch() {
    return isMobile();
  }

  /** Form control for selection input */
  get selectionControl() {
    return this.parent.get('selection') as FormControl;
  }

  /** Form control for date input */
  get dateControl() {
    return this.parent.get('date') as FormControl;
  }

  /** Form control for count input */
  get countControl() {
    return this.parent.get('count') as FormControl;
  }

  /** Gets the active error message. */
  dateErrorMessage(): string {
    if (this.dateControl.hasError('required')) {
      return 'Date is required';
    }

    if (this.dateControl.hasError('matDatepickerFilter')) {
      return 'Date must be later than today';
    }

    if (this.hasEndAfterStartError) {
      return 'End date must be after start date';
    }

    return null;
  }

  /** Date filter to ensure dates are after the end of today */
  laterThanToday(d: Date): boolean {
    return isAfter(d, endOfToday());
  }
}
