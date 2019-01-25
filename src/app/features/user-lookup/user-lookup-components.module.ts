import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule, MatIconModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { SatPopoverModule } from '@ncstate/sat-popover';

import { ResourceAvatarModule } from '@app/shared/resource-avatar';
import { ActiveBadgeModule } from '@app/shared/active-badge';

import * as fromComponents from './components';

// TODO: this module is separate from the rest of the UserLookupModule because
// the UserDetailPageComponent is being used by the ProfileModule. This module
// is presentational only and does not include routing, NGRX feature stores, etc.
//
// IT SHOULD BE REMOVED as soon as a better approach becomes apparent. Cross-referecing
// domain-specific components and modules like this is far from ideal.
@NgModule({
  imports: [
    CommonModule,
    ResourceAvatarModule,
    ActiveBadgeModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    SatPopoverModule,
    RouterModule,
  ],
  declarations: [
    ...fromComponents.components,
  ],
  exports: [
    ...fromComponents.components
  ]
})
export class UserLookupComponentsModule { }
