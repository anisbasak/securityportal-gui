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
import { takeUntil } from 'rxjs/operators';

import { findInsertIndex } from '@app/shared';

@Component({
  selector: 'dow-select',
  styleUrls: ['./dow-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container [formGroup]="parent">
      <multi-day-select
        [disabled]="daysOfWeekControl.disabled"
        [preventNone]="true"
        [options]="days"
        [selectedIndicies]="daysOfWeekControl.value"
        (select)="toggleSelectItem($event)">
      </multi-day-select>
    </ng-container>
  `
})
export class DayOfWeekSelectComponent implements OnInit, OnDestroy  {

  /** Parent form group */
  @Input() parent: FormGroup;

  /** Labels for the days in a week */
  days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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

  /** Days of week form array */
  get daysOfWeekControl() {
    return this.parent.get('daysOfWeek') as FormArray;
  }

  /** Toggle active/inactive for index in days array */
  toggleSelectItem(index: number) {
    const controlIndex = this.daysOfWeekControl.value.indexOf(index);

    if (controlIndex > -1) {
      // Day found in array, so remove it
      this.daysOfWeekControl.removeAt(controlIndex);
    } else {
      // Day not found in array, so insert it at correct index
      const newIndex = findInsertIndex(this.daysOfWeekControl.value, index);
      this.daysOfWeekControl.insert(newIndex, new FormControl(index));
    }
  }
}
