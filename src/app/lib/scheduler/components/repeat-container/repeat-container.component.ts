import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SatRepeat } from '@app/lib/repeat';

interface RepeatDialogData {
  value: SatRepeat;
  allowRelativeRepeat: boolean;
}

@Component({
  styleUrls: ['./repeat-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sat-repeat
      [initialValue]="data.value"
      [allowRelative]="data.allowRelativeRepeat"
      (onCancel)="cancel()"
      (onSubmit)="confirm($event)">
    </sat-repeat>
  `
})
export class RepeatContainerComponent {

  constructor(
    private dialogRef: MatDialogRef<RepeatContainerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RepeatDialogData
  ) { }

  cancel() {
    this.dialogRef.close();
  }

  confirm(val: SatRepeat) {
    this.dialogRef.close(val);
  }
}
