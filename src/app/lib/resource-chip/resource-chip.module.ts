import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatChipsModule } from '@angular/material';

import { ResourceAvatarModule } from '@app/shared/resource-avatar';
import { SatResourceChipComponent } from './resource-chip.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule,
    ResourceAvatarModule,
  ],
  declarations: [
    SatResourceChipComponent
  ],
  exports: [
    SatResourceChipComponent
  ]
})
export class SatResourceChipModule { }
