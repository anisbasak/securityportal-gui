
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, Subject } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';
import * as addDays from 'date-fns/add_days';
import * as addHours from 'date-fns/add_hours';
import * as format from 'date-fns/format';
import * as isDate from 'date-fns/is_date';
import * as startOfDay from 'date-fns/start_of_day';

import { DatetimeAfterNow } from '../../validators/datetime-after-now.validator';
import { EndAfterStart } from '../../validators/end-after-start.validator';
import { SatSchedule } from '../../models/schedule.model';
import { CustomValidators } from '@app/shared';


@Component({
  selector: 'sat-scheduler',
  styleUrls: ['./scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="submitForm()">

      <!-- Start -->
      <start-selector
        [parent]="startGroup"
        [placeholder]="startPlaceholder"
        [showEnabled]="!autoEnable">
      </start-selector>

      <!-- Repeat -->
      <repeat-selector
        *ngIf="startEnabled"
        [allowRelativeRepeat]="allowRelativeRepeat"
        [parent]="repeatGroup">
      </repeat-selector>

      <!-- End -->
      <end-selector
        *ngIf="endGroup.enabled"
        [parent]="endGroup"
        [hasEndAfterStartError]="form.hasError('endAfterStart')"
        [minCount]="countLimits.min"
        [maxCount]="countLimits.max">
      </end-selector>

      <!-- Actions -->
      <div class="actions" *ngIf="showActions">
        <button mat-button color="primary" class="button" type="button"
          (click)="cancelForm()">
          Cancel
        </button>
        <button mat-button color="primary" class="button" type="submit"
          [disabled]="form.disabled || form.invalid">
          Save
        </button>
      </div>

    </form>
  `
})
export class SatSchedulerComponent implements OnInit, OnDestroy {

  /** Initial form state to populate the form's control values */
  @Input() initialState: SatSchedule;

  /** Whether relative dates are allowed in repeat form */
  @Input() allowRelativeRepeat = true;

  /** Whether new schedules should enable themselves automatically */
  @Input() autoEnable = false;

  /** Whether the cancel and save actions should be displayed */
  @Input() showActions = true;

  /** Event emitted when form is canceled */
  @Output() cancel = new EventEmitter<void>();

  /** Event emitted when form is submitted  */
  @Output() confirm = new EventEmitter<SatSchedule>();

  /** Form group for managing scheduler form */
  form: FormGroup;

  /** Min and max values for the end count */
  countLimits = { min: 1, max: 1000 };

  /** Subject that emits when the component is destroyed */
  private destroy = new Subject<void>();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    // Initialize and override form value with initial state
    this.form = this.initializeForm(this.autoEnable);
    this.overrideForm(this.initialState);

    // Subscribe to changes in the form and set appropriate enabled/disabled states
    merge(
      this.startGroup.get('enabled').valueChanges,
      this.repeatGroup.get('selection').valueChanges,
      this.endGroup.get('selection').valueChanges
    ).pipe(
      startWith(null),
      takeUntil(this.destroy),
    )
    .subscribe(() => this.enableAppropriateControls());
  }

  /** Cancel subscriptions */
  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  /** Form group for the start controls */
  get startGroup() {
    return this.form.get('start') as FormGroup;
  }

  /** Form group for the repeat controls */
  get repeatGroup() {
    return this.form.get('repeat') as FormGroup;
  }

  /** Form group for the end controls */
  get endGroup() {
    return this.form.get('end') as FormGroup;
  }

  /** Whether the start datetime is enabled */
  get startEnabled() {
    return this.startGroup.get('enabled').value as boolean;
  }

  /** Whether repeat is set to somethiing other than none */
  get repeatEnabled() {
    return this.repeatGroup.get('selection').value !== 'none';
  }

  /** String to display as the start select placeholder */
  get startPlaceholder(): string {
    return this.repeatEnabled ? 'Start' : 'When';
  }

  /** Returns the form value */
  getValue(): SatSchedule {
    return this.form.value;
  }

  /** Emit a cancel event */
  cancelForm() {
    this.cancel.emit();
  }

  /** Emit a confirm event carrying the form value */
  submitForm() {
    if (this.form.valid) {
      this.confirm.emit(this.form.value);
    }
  }

  /** Set whether an abstract control is enabled/disabled */
  private enableControl(control: AbstractControl, enable: boolean) {
    if (enable && control.disabled) {
      control.enable();
    }
    if (!enable && control.enabled) {
      control.disable();
    }
  }

  /** Use current form state to enable or disable the appropriate controls */
  private enableAppropriateControls() {

    // Don't try to override anything if the whole form is disabled
    if (this.form.disabled) {
      return;
    }

    // Enable start group controls and repeat group when start has been enabled
    [
      this.startGroup.get('date'),
      this.startGroup.get('time'),
      this.repeatGroup
    ].forEach(x => this.enableControl(x, this.startEnabled));

    // Enable end group when both start and repeat have been enabled
    this.enableControl(this.endGroup, this.startEnabled && this.repeatEnabled);

    // Enable appropriate end date/count controls end group has been enabled
    this.enableControl(
      this.endGroup.get('date'),
      this.endGroup.enabled && this.endGroup.get('selection').value === 'date'
    );

    this.enableControl(
      this.endGroup.get('count'),
      this.endGroup.enabled && this.endGroup.get('selection').value === 'count'
    );

  }

  /** Return a new, intialized form group */
  private initializeForm(enabled: boolean) {
    const oneHourFromNow = addHours(new Date(), 1);
    return this.fb.group({
      // start group
      start: this.fb.group({
        enabled: enabled,
        date: [startOfDay(oneHourFromNow), Validators.required],
        time: [`${format(oneHourFromNow, 'HH')}:00`, Validators.required]
      }, {
        validator: DatetimeAfterNow
      }),
      // repeat group
      repeat: this.fb.group({
        selection: 'none',
        custom: null
      }),
      // end group
      end: this.fb.group({
        selection: 'never',
        date: [startOfDay(addDays(oneHourFromNow, 7)), Validators.required],
        count: [1, [Validators.required, CustomValidators.number(this.countLimits)]]
      })
    }, {
      // Form-wide validator to prevent end time being before start time
      validator: EndAfterStart
    });
  }

  /** Override form controls */
  private overrideForm(override: SatSchedule) {

    // Start group
    if (override && override.start) {
      this.startGroup.patchValue(override.start);

      // Update end date to be 7 days past start date
      if (isDate(override.start.date)) {
        this.endGroup.patchValue({
          date: startOfDay(addDays(override.start.date, 7))
        });
      }
    }

    // Repeat group
    if (override && override.repeat) {
      this.repeatGroup.patchValue(override.repeat);
    }

    // End group
    if (override && override.end) {
      this.endGroup.patchValue(override.end);
    }
  }

}
