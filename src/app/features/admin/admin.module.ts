import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/common';
import { AdminComponent } from './admin.component';
import { FEATURE_ROUTES } from './features/admin-features';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AdminComponent,
  },
  ...FEATURE_ROUTES
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AdminComponent
  ],
  providers: []
})

export class AdminModule {
}
