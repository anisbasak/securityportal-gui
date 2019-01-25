import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/common';
import { HelpComponent } from './help.component';

export const routes: Routes = [
  {
    path: '',
    component: HelpComponent,
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    HelpComponent
  ],
  providers: []
})

export class HelpModule {
}
