import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { getImageSrc } from '@app/core/util';
import * as fromServices from '../../services';

@Component({
  selector: 'resource-avatar',
  styleUrls: ['./resource-avatar.component.scss'],
  providers: [fromServices.ImageLoaderService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="profile-image"
      [style.background-image]="_profileImageUrl"
      [style.background-color]="(_showFallback ? _color : '')"
      [class.show]="_showAvatar"
      [class.round]="circle">
      <span *ngIf="_showFallback">{{ _resourceInitial }}</span>
    </div>
  `
})
export class ResourceAvatarComponent {

  /** Background color to use in fallback mode. */
  _color = 'rgba(0, 0, 0, 0.2)';

  /** Initial of the resource to use in fallback mode. */
  _resourceInitial = '?';

  /** CSS url style for the profile image. */
  _profileImageUrl: SafeStyle;

  /** Whether the avatar should be shown. */
  _showAvatar = false;

  /** Whether the generated fallback image should be shown vs the profile image. */
  _showFallback = false;

  /** Whether the avatar should display as a circle. Defaults to `true`. */
  @Input() circle = true;

  /**
   * ID of image to be shown.
   * A null value will show the fallback. An undefined value will display nothing.
   */
  @Input() set avatarMd5(md5: string) {
    if (md5) {
      const imageSrc = getImageSrc(md5);
      this._profileImageUrl = this.sanitizer.bypassSecurityTrustStyle(`url('${imageSrc}')`);
      this.imageLoaderService.load(imageSrc)
        .then(() => this._showFallback = false)
        .then(() => this._setAvatarVisible())
        .catch(e => this._useFallbackImage());
    } else if (md5 === null) {
      this._useFallbackImage();
    }
  }

  /** Resource name to be used for generating fallback image. */
  @Input() set name(val: string) {
    if (val && typeof val === 'string') {
      this._color = this.randomColor.hashedColor(val);
      this._resourceInitial = val[0].toUpperCase();
    }
  }

  constructor(
    private randomColor: fromServices.RandomColorGenerator,
    private imageLoaderService: fromServices.ImageLoaderService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
  ) { }

  /** Enable the fallback mode and show the avatar. */
  private _useFallbackImage() {
    this._showFallback = true;
    this._setAvatarVisible();
  }

  /** Show the avatar. */
  private _setAvatarVisible() {
    this._showAvatar = true;
    this.cd.markForCheck();
  }
}
