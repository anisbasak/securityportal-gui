import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SatJsonViewerComponent } from './json-viewer.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SatJsonViewerComponent
  ],
  exports: [
    SatJsonViewerComponent
  ]
})
export class SatJsonViewerModule { }
