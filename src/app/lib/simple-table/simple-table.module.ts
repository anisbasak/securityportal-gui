import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material';

import { SatTableLoaderModule } from '@app/lib/table-loader';
import { SatSimpleTableComponent } from './simple-table.component';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    SatTableLoaderModule,
  ],
  declarations: [
    SatSimpleTableComponent
  ],
  exports: [
    SatSimpleTableComponent
  ]
})
export class SatSimpleTableModule { }
