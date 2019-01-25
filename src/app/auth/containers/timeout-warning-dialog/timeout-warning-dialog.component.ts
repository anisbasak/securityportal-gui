import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

export interface TimeoutWarningDialogData {
  expiration: Date;
}

/**
 * This dialog component provides users with the opportunity to
 * sign out or maintain their session. The dialog will close with
 * a boolean representing the user's decision.
 */
@Component({
  styleUrls: ['./timeout-warning-dialog.component.scss'],
  template: `
    <h1 mat-dialog-title>Are you still there?</h1>
    <mat-dialog-content>
      You will be signed out in {{ expiration | dfnsDistanceInWordsToNow }}.
    </mat-dialog-content>
    <div mat-dialog-actions>
      <button mat-button class="button" [mat-dialog-close]="false">Sign out</button>
      <button
        cdkFocusInitial
        mat-flat-button
        class="button"
        color="accent"
        [mat-dialog-close]="true">
        Stay signed in
      </button>
    </div>
  `
})
export class TimeoutWarningDialogComponent {
  expiration: Date;

  constructor(@Inject(MAT_DIALOG_DATA) data: TimeoutWarningDialogData) {
    this.expiration = data.expiration;
  }
}
