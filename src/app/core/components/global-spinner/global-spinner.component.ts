import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sp-global-spinner',
  styleUrls: ['./global-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-spinner [diameter]="16"></mat-spinner>
  `
})
export class GlobalSpinnerComponent { }
