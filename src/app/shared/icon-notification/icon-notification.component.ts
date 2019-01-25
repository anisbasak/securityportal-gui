import { ChangeDetectionStrategy, Component, Input, HostBinding } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';

// TODO(will): can't use string interpolation with anything that is
// aot compiled
const TIMING_IN = '160ms cubic-bezier(0.0, 0.0, 0.2, 1)';
const TIMING_OUT = '150ms cubic-bezier(0.4, 0.0, 1, 1)';

@Component({
  selector: 'sp-icon-notification',
  styleUrls: ['./icon-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  animations: [
    trigger('expandInOut', [
      transition('* => void', [
        style({ transform: 'scale(1)' }),
        animate(TIMING_IN, style({ transform: 'scale(0)' }))
      ]),
      transition('void => *', [
        style({ transform: 'scale(0)' }),
        animate(TIMING_OUT, style({ transform: 'scale(1)' }))
      ]),
    ]),
  ]
})
export class IconNotificationComponent {

  @Input()
  @HostBinding('class')
  color: 'primary' | 'accent' | 'warn';

  @HostBinding('@expandInOut') animate = true;
}
