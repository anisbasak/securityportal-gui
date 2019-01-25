import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatIconModule, MatButtonModule, MatDialogModule, MatTooltipModule } from '@angular/material';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ResourceAvatarModule } from '@app/shared/resource-avatar';
import { IconNotificationModule } from '@app/shared/icon-notification';
import { SimpleDialogModule } from '@app/shared/simple-dialog';

import { reducers, effects } from './store';
import * as fromContainers from './containers';
import * as fromServices from './services';
import * as fromGuards from './guards';
import { routes } from './routes';

// TODO: remove the need for this
import { UserLookupComponentsModule } from './user-lookup-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ResourceAvatarModule,
    IconNotificationModule,
    SimpleDialogModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    SatPopoverModule,
    UserLookupComponentsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('user-lookup', reducers),
    EffectsModule.forFeature(effects),
  ],
  declarations: [
    ...fromContainers.containers,
  ],
  providers: [
    fromServices.UserLookupService,
    ...fromGuards.guards
  ],
  entryComponents: [
    fromContainers.UserLookupFormAdvancedDialogComponent,
  ]
})
export class UserLookupModule { }
