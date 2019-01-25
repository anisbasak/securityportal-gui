import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

import { SatGenericOverlayComponent } from './generic-overlay.component';
import { SatGenericOverlayTrigger } from './generic-overlay-trigger.directive';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule
  ],
  declarations: [
    SatGenericOverlayComponent,
    SatGenericOverlayTrigger
  ],
  exports: [
    SatGenericOverlayComponent,
    SatGenericOverlayTrigger
  ]
})
export class SatGenericOverlayModule { }
