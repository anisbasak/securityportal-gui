import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import { state, style, transition, trigger, animate } from '@angular/animations';

// TODO(will): can't use string interpolation with anything that is
// aot compiled
// `${TIMING.desktop.standard} ${CURVE.standard}`
const EXPAND = '175ms cubic-bezier(0.4, 0.0, 0.2, 1)';

@Component({
  selector: 'glb-slide',
  styleUrls: ['./slide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideOpen', [
      state('true',   style({ height: '*' })),
      state('false', style({ height: 0 })),
      transition('true <=> false', animate(EXPAND))
    ])
  ],
  template: `
    <div [@slideOpen]="isOpen.toString()" class="slide">
      <ng-content *ngIf="isOpen"></ng-content>
    </div>
  `
})
export class SlideComponent {
  @Input() isOpen: boolean;
}
