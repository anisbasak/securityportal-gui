import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'sp-active-badge',
  styleUrls: ['./active-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class ActiveBadgeComponent {
  @Input() active: boolean;

  @HostBinding('class.active')
  get activeClass() {
    return this.active === true;
  }

  @HostBinding('class.inactive')
  get inactiveClass() {
    return this.active === false;
  }
}
