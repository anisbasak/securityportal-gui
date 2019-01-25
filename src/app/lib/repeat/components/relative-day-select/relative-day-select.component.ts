import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SatRelativeDay } from '../../models/repeat.model';
import { SelectOption } from '@app/shared';

@Component({
  selector: 'relative-day-select',
  styleUrls: ['./relative-day-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container [formGroup]="parent">
      <mat-form-field class="relative-select">
        <mat-select formControlName="relative">
          <ng-container *ngFor="let option of relativeOptions; let last=last">
            <sat-divider *ngIf="last"></sat-divider>
            <mat-option [value]="option.value">
              {{ option.name }}
            </mat-option>
          </ng-container>
        </mat-select>
      </mat-form-field>
      <mat-form-field class="type-select">
        <mat-select formControlName="type">
          <ng-container *ngFor="let option of typeOptions; let i=index">
            <sat-divider *ngIf="i === 7"></sat-divider>
            <mat-option [value]="option">
              {{ capitalizeTypeOption(option) }}
            </mat-option>
          </ng-container>
        </mat-select>
      </mat-form-field>
    </ng-container>
  `
})
export class RelativeDaySelectComponent implements OnInit, OnDestroy  {

  /** Parent form group */
  @Input() parent: FormGroup;

  /** Relative select options  */
  relativeOptions: SelectOption[] = [
    { name: 'First',  value: 0 },
    { name: 'Second', value: 1 },
    { name: 'Third',  value: 2 },
    { name: 'Fourth', value: 3 },
    { name: 'Fifth',  value: 4 },
    { name: 'Last',   value: -1 }
  ];

  /** Type select options */
  typeOptions: SatRelativeDay[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'day',
    'weekday',
    'weekend day'
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

  /** Convert a type option to capitalized first letter  */
  capitalizeTypeOption(type: SatRelativeDay): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

}
