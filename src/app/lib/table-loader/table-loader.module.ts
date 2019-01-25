import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material';

import { SatTableLoaderComponent, SatTableEmptyComponent } from './table-loader.component';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    SatTableLoaderComponent,
    SatTableEmptyComponent,
  ],
  exports: [
    SatTableLoaderComponent,
    SatTableEmptyComponent,
  ]
})
export class SatTableLoaderModule { }
