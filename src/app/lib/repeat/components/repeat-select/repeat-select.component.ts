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

import { SelectOption } from '@app/shared';

@Component({
  selector: 'repeat-select',
  styleUrls: ['./repeat-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container [formGroup]="parent">
      <span class="label">Frequency:</span>
      <mat-form-field>
        <mat-select formControlName="unit">
          <mat-option *ngFor="let option of options" [value]="option.value">
            {{ option.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </ng-container>
  `
})
export class RepeatSelectComponent implements OnInit, OnDestroy {

  /** Parent form group */
  @Input() parent: FormGroup;

  /** Repeat options allowed by the select */
  @Input() options: SelectOption[];

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
}
