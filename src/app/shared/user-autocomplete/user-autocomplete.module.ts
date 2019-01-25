import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/common';
import { ResourceAvatarModule } from '@app/shared/resource-avatar';

import * as fromContainers from './containers';
import * as fromComponents from './components';
import * as fromServices from './services';

@NgModule({
  imports: [
    ReactiveFormsModule,
    SharedModule,
    ResourceAvatarModule,
  ],
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
  ],
  providers: [
    fromServices.UserSearchService,
  ],
  exports: [
    fromContainers.UserAutocompleteComponent,
  ],
})
export class SatUserAutocompleteModule { }
