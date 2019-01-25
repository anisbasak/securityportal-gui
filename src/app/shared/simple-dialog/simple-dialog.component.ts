import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

export interface SimpleDialogData {
  title: string;
  message?: string;
  button?: string;
}

@Component({
  selector: 'sp-simple-dialog',
  template: `
    <h1 mat-dialog-title>{{ title }}</h1>
    <mat-dialog-content *ngIf="message">{{ message }}</mat-dialog-content>
    <div mat-dialog-actions>
      <button mat-flat-button class="button" color="primary" mat-dialog-close>{{ button }}</button>
    </div>
  `
})
// tslint:disable-next-line:component-class-suffix
export class SimpleDialog {
  title: string;
  message: string;
  button: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: SimpleDialogData) {
    this.title = data.title;
    this.message = data.message || '';
    this.button = data.button || 'Got it';
  }
}
