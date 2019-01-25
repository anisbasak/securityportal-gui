import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, Subject } from 'rxjs';
import { map, takeUntil, switchMap, tap, filter, take } from 'rxjs/operators';

import * as fromCore from '@app/core/store';
import * as fromStore from '../../store';
import {
  UserLookupFormAdvancedDialogComponent
} from '../user-lookup-form-advanced-dialog/user-lookup-form-advanced-dialog.component';
import { SimpleDialog } from '@app/shared/simple-dialog';

@Component({
  selector: 'app-user-lookup-form',
  styleUrls: ['./user-lookup-form.component.scss'],
  template: `
    <form (ngSubmit)="submit.next()">
      <div class="search">
        <app-general-lookup
          class="search__field"
          [value]="generalLookupValue$ | async"
          (valueChange)="updateGeneralField($event)">
        </app-general-lookup>

        <div class="search__controls">
          <button mat-icon-button color="accent" type="button" matTooltip="Advanced search" (click)="advanced()">
            <sp-icon-notification *ngIf="showAdvancedBadge$ | async"></sp-icon-notification>
            <mat-icon>settings</mat-icon>
          </button>
        </div>
      </div>

      <div class="buttons">
        <button class="buttons__btn" mat-stroked-button color="accent" type="submit">Search</button>
        <button class="buttons__btn" mat-stroked-button color="accent" type="button" (click)="clear()">Clear</button>
      </div>

      <div class="error">
        <div *ngIf="showError$ | async" class="error__message">
          Something went wrong. Please try again.
        </div>
      </div>
    </form>
  `
})
export class UserLookupFormComponent implements OnInit, OnDestroy {
  /** General text lookup for system users. */
  generalLookupValue$: Observable<string>;

  /** Whether the error message should be shown for the form. */
  showError$: Observable<boolean>;

  /** Whether advanced search conditions have been added. */
  showAdvancedBadge$: Observable<boolean>;

  submit = new Subject<void>();

  private advancedDialogRef: MatDialogRef<UserLookupFormAdvancedDialogComponent>;
  private destroy = new Subject<void>();

  constructor(
    private store: Store<fromCore.CoreState>,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.generalLookupValue$ = this.store.pipe(select(fromStore.getGeneralField));
    this.showError$ = this.store.pipe(select(fromStore.getLookupResultsError), map(val => !!val));
    this.showAdvancedBadge$ = combineLatest(
      this.store.pipe(select(fromStore.getUserFieldMapActive)),
      this.store.pipe(select(fromStore.getLinkFieldMapActive)),
    ).pipe(map(([x, y]) => x || y));

    this.submit.pipe(
      switchMap(() => this.store.pipe(select(fromStore.getFormEmpty), take(1))),
      tap(empty => {
        if (empty) {
          this.dialog.open(SimpleDialog, {
            data: {
              title: 'Invalid Lookup',
              message: 'Empty lookup conditions are not allowed.'
            }
          });
        }
      }),
      filter(empty => !empty),
      takeUntil(this.destroy),
    ).subscribe(() => this.store.dispatch(new fromStore.Lookup()));
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  updateGeneralField(general: string) {
    this.store.dispatch(new fromStore.UpdateFormGeneralField(general));
  }

  advanced() {
    if (!this.advancedDialogRef) {
      this.advancedDialogRef = this.dialog.open(UserLookupFormAdvancedDialogComponent);
      this.advancedDialogRef.afterClosed()
        .pipe(takeUntil(this.destroy))
        .subscribe(() => this.advancedDialogRef = null);
    }
  }

  clear() {
    this.store.dispatch(new fromStore.ClearUserResults());
    this.store.dispatch(new fromStore.ResetForm());
  }

}
