import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../common';
import { ResourceAvatarModule } from '../resource-avatar';
import { ActiveBadgeModule } from '../active-badge';

import { ResourceListItemComponent } from './list-item/list-item.component';

import { LayoutService } from './services/layout.service';

@NgModule({
  imports: [
    SharedModule,
    ResourceAvatarModule,
    ActiveBadgeModule,
    RouterModule,
  ],
  declarations: [
    ResourceListItemComponent,
  ],
  providers: [
    LayoutService
  ],
  exports: [
    ResourceListItemComponent,
  ]
}) export class ResourceModule { }
