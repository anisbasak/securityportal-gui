import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'sat-divider',
  styleUrls: ['./divider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class SatDividerComponent {

  /** Add role information for a11y */
  @HostBinding('attr.role') role = 'separator';

  /** Add orientation information for a11y */
  @HostBinding('attr.aria-orientation') ariaOrientation = 'horizontal';

}
