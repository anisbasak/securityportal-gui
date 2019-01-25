import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { SatConfirmDialogConfig, SatConfirmDialogButton } from './confirm-dialog.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./confirm.component.scss'],
  template: `
    <h1 matDialogTitle *ngIf="title">{{ title }}</h1>
    <div mat-dialog-content *ngIf="body">{{ body }}</div>
    <div mat-dialog-actions>

      <!-- Dismiss -->
      <button mat-button *ngIf="!dismiss.raised" class="button"
        [color]="dismiss.color"
        [matDialogClose]="false">
        {{ dismiss.text }}
      </button>
      <button mat-raised-button *ngIf="dismiss.raised" class="button"
        [color]="dismiss.color"
        [matDialogClose]="false">
        {{ dismiss.text }}
      </button>

      <!-- Confirm -->
      <button mat-button *ngIf="!confirm.raised" class="button"
        [color]="confirm.color"
        [matDialogClose]="true">
        {{ confirm.text }}
      </button>
      <button mat-raised-button *ngIf="confirm.raised" class="button"
        [color]="confirm.color"
        [matDialogClose]="true">
        {{ confirm.text }}
      </button>

    </div>
  `
})
export class SatConfirmComponent {

  /** Title of the dialog */
  title = '';

  /** Content of the dialog */
  body = '';

  /** Config for the dismiss button */
  dismiss: SatConfirmDialogButton = {
    text: 'Cancel',
    color: 'primary',
    raised: false
  };

  /** Config for the confirm button */
  confirm: SatConfirmDialogButton = {
    text: 'OK',
    color: 'primary',
    raised: false
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) data: SatConfirmDialogConfig
  ) {
    // Override default values
    this.title = data.title ? data.title : '';
    this.body = data.body;
    this.dismiss = Object.assign(this.dismiss, data.dismiss);
    this.confirm = Object.assign(this.confirm, data.confirm);
  }
}
