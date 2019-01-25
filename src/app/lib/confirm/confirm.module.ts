import { NgModule } from '@angular/core';

import { SatConfirmComponent } from './confirm.component';
import { SatConfirmService } from './confirm.service';
import { SharedModule } from '@app/shared/common';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    SatConfirmComponent,
  ],
  providers: [
    SatConfirmService,
  ],
  entryComponents: [
    SatConfirmComponent,
  ]
})
export class SatConfirmModule { }
