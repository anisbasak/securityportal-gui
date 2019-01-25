import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';

import { getImageSrc } from '@app/core/util';
import { Avatar } from '@app/core/models';
import { ResourceGalleryLightboxComponent } from '../resource-gallery-lightbox/resource-gallery-lightbox.component';
import * as fromServices from '../../services';
import * as fromModels from '../../models';

const DEFAULT_COLOR = 'rgba(0, 0, 0, 0.2)';
const DEFAULT_INITIAL = '?';

@Component({
  selector: 'resource-gallery',
  styleUrls: ['./resource-gallery.component.scss'],
  providers: [fromServices.ImageLoaderService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="profile-image"
      [style.background-image]="_profileImageUrl"
      [style.background-color]="(_showFallback ? _color : '')"
      [class.show]="_showAvatar">
      <span *ngIf="_showFallback">{{ _resourceInitial }}</span>
      <mat-icon class="gallery-icon"
        *ngIf="!_showFallback && _showGalleryToggle"
        (click)="viewGallery()">
        collections
      </mat-icon>
    </div>
  `
})
export class ResourceGalleryComponent {
  /** Background color to use in fallback mode. */
  _color = DEFAULT_COLOR;

  /** Initial of the resource to use in fallback mode. */
  _resourceInitial = DEFAULT_INITIAL;

  /** CSS url style for the profile image. */
  _profileImageUrl: SafeStyle;

  /** Whether the avatar should be shown. */
  _showAvatar = false;

  /** Whether the generated fallback image should be shown vs the profile image. */
  _showFallback = false;

  /** Whether the gallery toggle should be shown. */
  _showGalleryToggle = false;

  /** Optional images to display in a gallery. */
  _images: fromModels.GalleryImage[] = [];

  @Input() set avatar(avatar: Avatar) {
    const md5 = avatar ? avatar.large || avatar.original : null;

    if (md5) {
      this._disableFallback();
      const imageSrc = getImageSrc(md5);
      this.imageLoaderService.load(imageSrc)
        .then(() => this._enableImage(imageSrc))
        .catch(e => this._enableFallback());
    } else {
      this._enableFallback();
    }
  }

  @Input() set images(images: fromModels.GalleryImage[]) {
    if (images && images.length) {
      this._showGalleryToggle = true;
      this._images = images;
    } else {
      this._showGalleryToggle = false;
      this._images = [];
    }
    this.cd.markForCheck();
  }

  /** Resource name to be used for generating fallback image. */
  @Input() set name(val: string) {
    if (val && typeof val === 'string') {
      this._color = this.randomColor.hashedColor(val);
      this._resourceInitial = val[0].toUpperCase();
    } else {
      this._color = DEFAULT_COLOR;
      this._resourceInitial = DEFAULT_INITIAL;
    }
  }

  constructor(
    private randomColor: fromServices.RandomColorGenerator,
    private imageLoaderService: fromServices.ImageLoaderService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
  ) { }

  viewGallery() {
    if (this._images && this._images.length) {
      this.dialog.open<ResourceGalleryLightboxComponent, fromModels.GalleryLightboxData>(
        ResourceGalleryLightboxComponent, {
          backdropClass: 'sat-overlay-extra-dark-backdrop',
          panelClass: 'sat-no-padding-dialog',
          data: { images: this._images }
        }
      );
    }
  }

  private _enableImage(imageSrc: string) {
    this._profileImageUrl = this.sanitizer.bypassSecurityTrustStyle(`url('${imageSrc}'`);
    this._showFallback = false;
    this._setAvatarVisible(true);
  }

  private _enableFallback() {
    this._profileImageUrl = null;
    this._showFallback = true;
    this._setAvatarVisible(true);
  }

  private _disableFallback() {
    this._showFallback = false;
    this._setAvatarVisible(false);
  }

  private _setAvatarVisible(visible: boolean) {
    this._showAvatar = visible;
    this.cd.markForCheck();
  }

}
