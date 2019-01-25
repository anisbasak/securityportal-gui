import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { SimpleDialog } from './simple-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  declarations: [
    SimpleDialog,
  ],
  exports: [
    SimpleDialog,
  ],
  entryComponents: [
    SimpleDialog,
  ],
})
export class SimpleDialogModule { }
