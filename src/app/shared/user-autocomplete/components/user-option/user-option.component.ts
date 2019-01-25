import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sp-user-option',
  styleUrls: ['./user-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <resource-avatar class="avatar" [avatarMd5]="avatarMd5" [name]="name"></resource-avatar>
    <div class="name" [innerHTML]="name | bold:searchTerm"></div>
  `
})
export class UserOptionComponent {
  /** MD5 of the user's image. `null` will show fallback */
  @Input() avatarMd5: string;

  /** User's display name */
  @Input() name: string;

  /** Filter term  */
  @Input() searchTerm: string;
}
