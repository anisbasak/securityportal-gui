import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { MatCardModule } from '@angular/material';

import { ActiveBadgeModule } from '@app/shared/active-badge';
import { ResourceAvatarModule } from '@app/shared/resource-avatar';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import * as fromServices from './services';

export const routes: Routes = [
  {
    path: '',
    component: fromContainers.ViewPageComponent,
  },
  {
    path: ':id',
    component: fromContainers.ViewPageComponent,
  }
];


@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule,
    MatCardModule,
    ActiveBadgeModule,
    ResourceAvatarModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    fromServices.ViewService,
  ],
  declarations: [
    ...fromComponents.components,
    ...fromContainers.containers,
  ]
})
export class ViewModule { }
