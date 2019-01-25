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
  selector: 'moy-select',
  styleUrls: ['./moy-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container [formGroup]="parent">
      <multi-day-select
        extraClass="medium"
        [disabled]="monthsOfYearControl.disabled"
        [preventNone]="true"
        [options]="months"
        [selectedIndicies]="monthsOfYearControl.value"
        (select)="toggleSelectItem($event)">
      </multi-day-select>
    </ng-container>
  `
})
export class MonthOfYearSelectComponent implements OnInit, OnDestroy  {

  /** Parent form group */
  @Input() parent: FormGroup;

  /** Labels for months in a year */
  months = [
    'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug',
    'Sep', 'Oct', 'Nov', 'Dec',
  ];

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

  /** Months of year form control */
  get monthsOfYearControl() {
    return this.parent.get('monthsOfYear') as FormArray;
  }

  /** Toggle active/inactive for index in months array */
  toggleSelectItem(index: number) {
    const controlIndex = this.monthsOfYearControl.value.indexOf(index);

    if (controlIndex > -1) {
      // Day found in array, so remove it
      this.monthsOfYearControl.removeAt(controlIndex);
    } else {
      // Day not found in array, so insert it at correct index
      const newIndex = findInsertIndex(this.monthsOfYearControl.value, index);
      this.monthsOfYearControl.insert(newIndex, new FormControl(index));
    }
  }
}
