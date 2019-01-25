import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
  Component,
  Input,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as isBefore from 'date-fns/is_before';
import * as startOfToday from 'date-fns/start_of_today';

import { isMobile } from '@app/shared';

@Component({
  selector: 'start-selector',
  styleUrls: ['./start-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="start-group" [formGroup]="parent">
      <mat-checkbox *ngIf="showEnabled" formControlName="enabled">Execute later</mat-checkbox>
      <div class="start-controls">
        <!-- Date -->
        <mat-form-field>
          <input matInput formControlName="date"
            [placeholder]="(placeholder ? placeholder : 'Start')"
            [matDatepicker]="datepicker"
            [matDatepickerFilter]="todayOrLater">
          <mat-datepicker-toggle matSuffix [disabled]="dateControl.disabled" [for]="datepicker"></mat-datepicker-toggle>
          <mat-error *ngIf="dateControl.hasError('required')">Date is required</mat-error>
          <mat-error *ngIf="!dateControl.hasError('required')">Date must be today or later</mat-error>
        </mat-form-field>
        <mat-datepicker #datepicker [touchUi]="useTouch"></mat-datepicker>

        <!-- Time -->
        <mat-form-field>
          <input matInput type="time"
            formControlName="time"
            [errorStateMatcher]="timeErrorStateMatcher">
          <mat-error *ngIf="timeControl.hasError('required')">Time is required</mat-error>
          <mat-error *ngIf="showDatetimeIsPastError()">Time must be after now</mat-error>
        </mat-form-field>
      </div>
    </div>
  `
})
export class StartSelectorComponent implements OnInit, OnDestroy {

  /** Parent form group */
  @Input() parent: FormGroup;

  /** Placholder override for date input */
  @Input() placeholder: string;

  /** Whether the enable checkbox should be displayed */
  @Input() showEnabled = true;

  /** Error state matcher for the time control. */
  timeErrorStateMatcher: ErrorStateMatcher = {
    isErrorState: (control) => control.invalid || this.showDatetimeIsPastError()
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

  /** Form control for the date input */
  get dateControl() {
    return this.parent.get('date') as FormControl;
  }

  /** Form control for the time input */
  get timeControl() {
    return this.parent.get('time') as FormControl;
  }

  /** Whether the datetime is past error should be displayed */
  showDatetimeIsPastError() {
    return !this.timeControl.hasError('required')
      && this.dateControl.valid
      && this.parent.hasError('datetimeIsPast');
  }

  /** Date filter to ensure dates are from the beginning of today and on */
  todayOrLater(d: Date): boolean {
    return !isBefore(d, startOfToday());
  }
}
