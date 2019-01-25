import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'repeat-adjust',
  styleUrls: ['./repeat-adjust.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container [formGroup]="parent">

      <!-- Frequency select -->
      <div class="frequency-select">
        <span class="label">Every</span>
        <mat-form-field>
          <input matInput formControlName="frequency"
            type="number"
            [min]="minFrequency"
            [max]="maxFrequency">
          <mat-error *ngIf="frequencyControl.hasError('required')">Required</mat-error>
          <mat-error *ngIf="!frequencyControl.hasError('required')">
            Min: {{ minFrequency }}, Max: {{ maxFrequency }}
          </mat-error>
        </mat-form-field>
        <span>{{ unitSuffix }}</span>
      </div>

      <!-- Adjustments -->
      <div formGroupName="adjustment" [ngSwitch]="unit">

        <!-- Weekly -->
        <dow-select *ngSwitchCase="'week'"
          [parent]="adjustmentGroup">
        </dow-select>

        <!-- Monthly -->
        <ng-container *ngSwitchCase="'month'">
          <mat-radio-group>

            <mat-radio-button
              *ngIf="allowRelative"
              [value]="true"
              [disabled]="adjustmentGroup.disabled"
              [checked]="dayOfMonthControl.enabled"
              (change)="updateMonthAdjustOption($event.value)">
               Each
            </mat-radio-button>
            <dom-select
              [parent]="adjustmentGroup">
            </dom-select>

            <mat-radio-button
              *ngIf="allowRelative"
              [value]="false"
              [disabled]="adjustmentGroup.disabled"
              [checked]="!dayOfMonthControl.enabled"
              (change)="updateMonthAdjustOption($event.value)">
               On the:
            </mat-radio-button>
            <relative-day-select
              *ngIf="allowRelative"
              [parent]="relativeDayOfMonthGroup">
            </relative-day-select>

          </mat-radio-group>
        </ng-container>

        <!-- Yearly -->
        <ng-container *ngSwitchCase="'year'">

          <moy-select
            [parent]="adjustmentGroup">
          </moy-select>

          <mat-checkbox
            *ngIf="allowRelative"
            [disabled]="adjustmentGroup.disabled"
            [checked]="relativeDayOfMonthGroup.enabled"
            (change)="updateYearAdjustOption($event.checked)">
            On the:
          </mat-checkbox>
          <relative-day-select
            *ngIf="allowRelative"
            [parent]="relativeDayOfMonthGroup">
          </relative-day-select>

        </ng-container>
      </div>
    </ng-container>
  `
})
export class RepeatAdjustComponent implements OnInit, OnDestroy {

  /** Parent form group */
  @Input() parent: FormGroup;

  /** Frequency unit */
  @Input() unit: string;

  /** Minimum frequency allowed by input */
  @Input() minFrequency = 0;

  /** Maximum frequency allowed by input */
  @Input() maxFrequency = 100;

  /** Whether relative dates are allowed for month and year selections */
  @Input() allowRelative = true;

  /** Subject that emits when component is destroyed */
  private destroy = new Subject<void>();

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.parent.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.cd.markForCheck());
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  /** Frequency form control */
  get frequencyControl() {
    return this.parent.get('frequency') as FormControl;
  }

  /** Adjustment form group */
  get adjustmentGroup() {
    return this.parent.get('adjustment') as FormGroup;
  }

  /** Relative day of month form group */
  get relativeDayOfMonthGroup() {
    return this.adjustmentGroup.get('relativeDayOfMonth') as FormGroup;
  }

  /** Day of month form array */
  get dayOfMonthControl() {
    return this.adjustmentGroup.get('daysOfMonth') as FormArray;
  }

  /** The suffix depending on the current unit */
  get unitSuffix(): string {
    let str = `${this.unit}(s)`;

    if (this.unit === 'week') {
      str += ' on:';
    }

    if (this.unit === 'year') {
      str += ' in:';
    }

    return str;
  }

  /** Mark month controls disabled depending on passed in value */
  updateMonthAdjustOption(val: boolean) {
    if (val) {
      this.dayOfMonthControl.enable();
      this.relativeDayOfMonthGroup.disable();
    } else {
      this.dayOfMonthControl.disable();
      this.relativeDayOfMonthGroup.enable();
    }
  }

  /** Mark year controls disabled based on passed in value */
  updateYearAdjustOption(val: boolean) {
    if (val) {
      this.relativeDayOfMonthGroup.enable();
    } else {
      this.relativeDayOfMonthGroup.disable();
    }
  }

}
