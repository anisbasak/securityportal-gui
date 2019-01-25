import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { findInsertIndex } from '@app/shared';

@Component({
  selector: 'dom-select',
  styleUrls: ['./dom-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container [formGroup]="parent">
      <multi-day-select
        [disabled]="daysOfMonthControl.disabled"
        [preventNone]="true"
        [options]="days"
        [selectedIndicies]="selectedDaysAsIndicies"
        (select)="toggleSelectItem($event)">
      </multi-day-select>
    </ng-container>
  `
})
export class DayOfMonthSelectComponent implements OnInit, OnDestroy  {

  /** Parent form group */
  @Input() parent: FormGroup;

  /** Labels for the days in a month 1..31 */
  days = Array.from({length: 31}, (v, k) => k + 1);

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

  /** Days of month form array */
  get daysOfMonthControl() {
    return this.parent.get('daysOfMonth') as FormArray;
  }

  /** Convert days to their indiciees by subtracting 1 */
  get selectedDaysAsIndicies() {
    return this.daysOfMonthControl.value.map(x => x - 1);
  }

  /** Toggle active/inactive for index in days array */
  toggleSelectItem(index: number) {
    const day = index + 1;
    const controlIndex = this.daysOfMonthControl.value.indexOf(day);

    if (controlIndex > -1) {
      // Day found in array, so remove it
      this.daysOfMonthControl.removeAt(controlIndex);
    } else {
      // Day not found in array, so insert it at correct index
      const newIndex = findInsertIndex(this.daysOfMonthControl.value, day);
      this.daysOfMonthControl.insert(newIndex, new FormControl(day));
    }

  }

}
