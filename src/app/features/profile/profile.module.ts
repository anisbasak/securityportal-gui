import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material';

import { ProfileUserGuard } from '@app/core/guards';
import { ResourceAvatarModule } from '@app/shared/resource-avatar';
import { ProfileComponent } from './profile.component';

// TODO: this is not advisable, but is required while we are sharing
// components between the user lookup results and profile page.
import { UserLookupComponentsModule } from '@app/features/user-lookup/user-lookup-components.module';

export const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [ProfileUserGuard],
  }
];

@NgModule({
  imports: [
    CommonModule,
    ResourceAvatarModule,
    MatCardModule,
    RouterModule.forChild(routes),
    // TODO: remove the need for this
    UserLookupComponentsModule,
  ],
  declarations: [
    ProfileComponent
  ],
  exports: [
    ProfileComponent
  ],
})
export class ProfileModule {
}
