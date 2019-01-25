
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatOptionSelectionChange } from '@angular/material';
import { of, merge, Observable, Subject } from 'rxjs';
import { refCount, publishReplay, switchMap, takeUntil, tap, filter } from 'rxjs/operators';

import { RepeatContainerComponent } from '../repeat-container/repeat-container.component';
import { SatRepeatTranslationUtil, SatRepeat, SatRepeatUnit } from '@app/lib/repeat';
import { SatGenericOverlayTrigger } from '@app/lib/generic-overlay';
import { SelectOption, isMobile } from '@app/shared';

@Component({
  selector: 'repeat-selector',
  styleUrls: ['./repeat-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="repeat-group" [formGroup]="parent">

      <!-- Repeat selection -->
      <mat-form-field>
        <mat-select
          placeholder="Repeat"
          formControlName="selection"
          [satGenericOverlayTriggerFor]="repeat"
          [satToggleOnClick]="false">
          <ng-container *ngFor="let option of options; let last=last">
            <sat-divider *ngIf="last"></sat-divider>
            <mat-option [value]="option.value" (onSelectionChange)="emitSelectionChange($event)">
              {{ option.name }}
            </mat-option>
          </ng-container>
        </mat-select>
      </mat-form-field>

      <!-- Description -->
      <div class="description" *ngIf="!!customControl.value">
        {{ getCustomRepeatDescription() }}
      </div>

      <!-- Repeat (to be used on desktop) -->
      <sat-generic-overlay #repeat
        xPosition="after"
        yPosition="center">
        <div class="repeat-overlay">
          <sat-repeat
            [initialValue]="initialRepeatData"
            [allowRelative]="allowRelativeRepeat"
            (onCancel)="cancelRepeatOverlay()"
            (onSubmit)="confirmRepeatOverlay($event)">
          </sat-repeat>
        </div>
      </sat-generic-overlay>

    </div>
  `
})
export class RepeatSelectorComponent implements OnInit, OnDestroy {

  /** Parent form group */
  @Input() parent: FormGroup;

  /** Whether relative dates are allowed in repeat form */
  @Input() allowRelativeRepeat = true;

  /** Initial repeat data to inject into a fresh repeat component */
  initialRepeatData: SatRepeat;

  /** An array of options for the repeat select */
  options: SelectOption[] = [
    { value: 'none',   name: 'None'        },
    { value: 'day',    name: 'Every Day'   },
    { value: 'week',   name: 'Every Week'  },
    { value: 'month',  name: 'Every Month' },
    { value: 'year',   name: 'Every Year'  },
    { value: 'custom', name: 'Custom...'   }
  ];

  /** Reference to repeat overlay trigger */
  @ViewChild(SatGenericOverlayTrigger)
  private repeatTrigger: SatGenericOverlayTrigger;

  /** Reference to repeat dialog */
  private repeatDialogRef: MatDialogRef<RepeatContainerComponent>;

  /** Stream of selections made by the user */
  private selection$ = new Subject<string>();

  /** Store the last non-custom selection so canceled dialogs can revert */
  private lastRepeatSelection: string;

  /** Subject that emits when the component is destroyed */
  private destroy = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Save the default value
    this.lastRepeatSelection = this.selectionControl.value;

    /** Observable of non-custom selections */
    const nonCustomSelection$ = this.selection$
      .pipe(
        filter(x => x !== 'custom'),
        tap(selection => this.updateControlValues(selection)),
      );

    /** Observable of dialog return value */
    const repeatResult$ = this.selection$.
      pipe(
        filter(x => x === 'custom'),
        switchMap(x => this.openRepeatComponent(this.lastRepeatSelection)),
        publishReplay(),
        refCount(),
      );

    /** Observable of cancel events from the dialog */
    const customCancel$ = repeatResult$
      .pipe(
        filter(x => !x),
        tap(() => this.updateControlValues(this.lastRepeatSelection)),
      );

    /** Observable of confirm events from the dialog */
    const customConfirm$ = repeatResult$.pipe(
      filter(x => !!x),
      tap(x => this.customControl.setValue(x)),
      tap(() => this.lastRepeatSelection = this.selectionControl.value),
    );

    // Subscribe custom and non-custom selection flows
    merge(customCancel$, customConfirm$, nonCustomSelection$)
      .pipe(takeUntil(this.destroy))
      .subscribe();

    // Mark for check after form changes
    this.parent.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.cd.markForCheck());
  }

  /** Cancel subscriptions and close any open dialogs */
  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();

    if (this.repeatDialogRef) {
      this.repeatDialogRef.close();
    }

    if (this.repeatTrigger) {
      this.repeatTrigger.closeGenericOverlay();
    }
  }

  /** Form control for repeat selection */
  get selectionControl() {
    return this.parent.get('selection') as FormControl;
  }

  /** Form control for custom repeat value */
  get customControl() {
    return this.parent.get('custom') as FormControl;
  }

  /**
   * Set the select value with the selection. If the selection
   * isn't 'custom', clear the custom control and save it as
   * the last repeat selection.
   */
  updateControlValues(selection: string) {
    this.selectionControl.setValue(selection);

    if (selection !== 'custom') {
      this.customControl.setValue(null);
      this.lastRepeatSelection = this.selectionControl.value;
    }
  }

  /** Return human-readable string version of custom repeat value */
  getCustomRepeatDescription(): string {
    return SatRepeatTranslationUtil.repeat(this.customControl.value);
  }

  /** Emit selection value for selection observable when the user interacts with the select */
  emitSelectionChange(change: MatOptionSelectionChange) {
    if (change.isUserInput && change.source.selected) {
      this.selection$.next(change.source.value);
    }
  }

  /** Repeat selection was cancelled, so close the generic overlay */
  cancelRepeatOverlay() {
    this.repeatTrigger.closeGenericOverlay();
  }

  /** Repeat selection was confirmed, so close the generic overlay with a value */
  confirmRepeatOverlay(value: SatRepeat) {
    this.repeatTrigger.closeGenericOverlay(value);
  }

  /** Open the custom repeat component and return a stream of its return/close value */
  private openRepeatComponent(previousSelection: string): Observable<any> {
    // Open with the default unit as the last selection if there is no other value
    if (!this.customControl.value && previousSelection !== 'none') {
      this.initialRepeatData = { unit: previousSelection as SatRepeatUnit, frequency: 1 };
    } else {
      this.initialRepeatData = this.customControl.value;
    }

    return isMobile() ? this.openRepeatAsDialog() : this.openRepeatAsGenericOverlay();
  }

  /** Open the custom repeat dialog and return its afterClosed stream */
  private openRepeatAsDialog(): Observable<any> {
    this.repeatDialogRef = this.dialog.open(RepeatContainerComponent, {
      panelClass: 'sat-full-screen-dialog',
      data: { value: this.initialRepeatData, allowRelativeRepeat: this.allowRelativeRepeat }
    });

    return this.repeatDialogRef.afterClosed();
  }

  /** Open the custom repeat positioned overlay and return its close stream */
  private openRepeatAsGenericOverlay(): Observable<any> {
    if (this.repeatTrigger) {
      this.repeatTrigger.openGenericOverlay();
      return this.repeatTrigger.onGenericOverlayClose;
    } else {
      return of(null);
    }
  }
}
