import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatIconModule, MatButtonModule } from '@angular/material';

import * as fromServices from './services';
import { ResourceAvatarComponent } from './containers/resource-avatar/resource-avatar.component';
import { ResourceGalleryComponent } from './containers/resource-gallery/resource-gallery.component';
import { ResourceGalleryLightboxComponent } from './containers/resource-gallery-lightbox/resource-gallery-lightbox.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [
    fromServices.ImageLoaderService,
    fromServices.RandomColorGenerator,
  ],
  declarations: [
    ResourceAvatarComponent,
    ResourceGalleryComponent,
    ResourceGalleryLightboxComponent,
  ],
  entryComponents: [
    ResourceGalleryLightboxComponent,
  ],
  exports: [
    ResourceAvatarComponent,
    ResourceGalleryComponent,
  ],
})
export class ResourceAvatarModule {}
