import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';
import * as getDay from 'date-fns/get_day';
import * as getDate from 'date-fns/get_date';
import * as getMonth from 'date-fns/get_month';
import * as format from 'date-fns/format';
import * as differenceInWeeks from 'date-fns/difference_in_weeks';
import * as startOfMonth from 'date-fns/start_of_month';

import { SatRepeat, SatRelativeDay } from '../../models/repeat.model';
import { CustomValidators, SelectOption } from '@app/shared';

@Component({
  selector: 'sat-repeat',
  styleUrls: ['./repeat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="submitForm()">
      <repeat-select
        [parent]="form"
        [options]="unitOptions">
      </repeat-select>

      <repeat-adjust
        [minFrequency]="frequencyLimits.min"
        [maxFrequency]="frequencyLimits.max"
        [parent]="form"
        [unit]="unitControl.value"
        [allowRelative]="allowRelative">
      </repeat-adjust>

      <div class="actions">
        <button mat-button
          color="primary"
          class="button"
          type="button"
          (click)="cancelForm()">
          Cancel
        </button>
        <button mat-button
          [disabled]="form.disabled || form.invalid"
          color="primary"
          class="button"
          type="submit">
          Done
        </button>
      </div>
    </form>
  `
})
export class SatRepeatComponent implements OnDestroy {

  /** Value to override default form value */
  @Input() set initialValue(val: SatRepeat) {
    if (val) {
      this.overrideFormValue(val);
    }
  }

  /** Whether relative dates are allowed for month and year selections */
  @Input() allowRelative = true;

  /** Event for when the form is submitted */
  @Output() onSubmit = new EventEmitter<SatRepeat>();

  /** Event for when the form is cancelled */
  @Output() onCancel = new EventEmitter<void>();

  /** Form group for managing the repeat model */
  form: FormGroup;

  /** Select options for the frequency units */
  unitOptions: SelectOption[] = [
    { value: 'day',   name: 'Daily'   },
    { value: 'week',  name: 'Weekly'  },
    { value: 'month', name: 'Monthly' },
    { value: 'year',  name: 'Yearly'  }
  ];

  /** Min and max values for the frequency input */
  frequencyLimits = { min: 1, max: 1000 };

  /** Subject to signal component destruction */
  private destroy = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    // Initialize form
    this.form = this.fb.group({
      unit: ['day', Validators.required],
      frequency: [1, [Validators.required, CustomValidators.number(this.frequencyLimits)]],
      adjustment: this.fb.group({
        daysOfWeek: this.fb.array([getDay(new Date())]),
        daysOfMonth: this.fb.array([getDate(new Date())]),
        relativeDayOfMonth: this.fb.group({
          relative: differenceInWeeks(new Date(), startOfMonth(new Date())),
          type: format(new Date(), 'dddd').toLowerCase() as SatRelativeDay
        }),
        monthsOfYear: this.fb.array([getMonth(new Date())])
      })
    });

    // Subscribe to changes on the unit control to update
    // which controls are enabled/disabled
    this.unitControl.valueChanges
      .pipe(
        startWith(this.unitControl.value),
        takeUntil(this.destroy),
      )
      .subscribe(x => this.setControlsDisabled(x));

    this.form.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.cd.markForCheck());
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  /** Form control for the frequency input */
  get frequencyControl() {
    return this.form.get('frequency') as FormControl;
  }

  /** Form control for the unit selection */
  get unitControl() {
    return this.form.get('unit') as FormControl;
  }

  /** Form group for the frequency adjustments */
  get adjustmentGroup() {
    return this.form.get('adjustment') as FormGroup;
  }

  /** Emit a cancel event */
  cancelForm() {
    this.onCancel.emit();
  }

  /** Emit an onSubmit event carrying the form value */
  submitForm() {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value);
    }
  }

  /** Toggle disabled status of form controls/arrays */
  private setControlsDisabled(unit: string) {

    if (unit === 'week') {
      this.adjustmentGroup.get('daysOfWeek').enable();
    } else {
      this.adjustmentGroup.get('daysOfWeek').disable();
    }

    this.adjustmentGroup.get('relativeDayOfMonth').disable();

    if (unit === 'month') {
      this.adjustmentGroup.get('daysOfMonth').enable();
    } else {
      this.adjustmentGroup.get('daysOfMonth').disable();
    }

    if (unit === 'year') {
      this.adjustmentGroup.get('monthsOfYear').enable();
    } else {
      this.adjustmentGroup.get('monthsOfYear').disable();
    }
  }

  /** Override form controls with valid SatRepeat */
  private overrideFormValue(val: SatRepeat) {
    // Override unit control
    if (val.unit) {
      this.unitControl.setValue(val.unit);
    }

    // Override frequency control
    if (val.frequency) {
      this.frequencyControl.setValue(val.frequency);
    }

    // Override adjustment group
    if (val.adjustment) {
      const adj = val.adjustment;

      if (adj.daysOfWeek && adj.daysOfWeek.length) {
        this.replaceFormArray(this.adjustmentGroup.get('daysOfWeek') as FormArray, adj.daysOfWeek);
      }

      if (adj.daysOfMonth && adj.daysOfMonth.length) {
        this.replaceFormArray(this.adjustmentGroup.get('daysOfMonth') as FormArray, adj.daysOfMonth);
      }

      if (adj.relativeDayOfMonth) {
        const value = adj.relativeDayOfMonth;
        const group = this.adjustmentGroup.get('relativeDayOfMonth');

        if (value.relative) {
          group.get('relative').setValue(value.relative);
        }

        if (value.type) {
          group.get('type').setValue(value.type);
        }

        // Set the control enabled since it exists
        if (group.disabled) {
          group.enable();
        }

        // Set the daysOfMonth control disabled since it exists
        // Only one can be enabled at a given time
        if (this.adjustmentGroup.get('daysOfMonth').enabled) {
          this.adjustmentGroup.get('daysOfMonth').disable();
        }
      }

      if (adj.monthsOfYear && adj.monthsOfYear.length) {
        this.replaceFormArray(this.adjustmentGroup.get('monthsOfYear') as FormArray, adj.monthsOfYear);
      }
    }
  }

  /** Remove all elements in a form array and push new values back as form controls */
  private replaceFormArray(array: FormArray, values: any[]) {
    while (array.length) {
      array.removeAt(0);
    }

    values.forEach(x => array.push(new FormControl(x)));
  }

}
