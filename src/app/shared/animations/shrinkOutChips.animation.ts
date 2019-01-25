import {
  trigger,
  group,
  style,
  animate,
  transition,
  AnimationTriggerMetadata
} from '@angular/animations';

// TODO(will): can't use string interpolation with anything that is
// aot compiled
// `${TIMING.desktop.enterScreen} ${CURVE.standard}`
const FADE_IN = '160ms cubic-bezier(0.4, 0.0, 0.2, 1)';

// `${TIMING.desktop.exitScreen} ${CURVE.standard}`
const FADE_OUT = '150ms cubic-bezier(0.4, 0.0, 0.2, 1)';

// `${TIMING.desktop.exitScreen} 50ms ${CURVE.standard}`
const SHRINK_OUT = '150ms cubic-bezier(0.4, 0.0, 0.2, 1)';

export const shrinkOut: AnimationTriggerMetadata = trigger('shrinkOut', [
  transition('* => void', [
    group([
      animate(FADE_OUT, style({
        opacity: '0'
      })),
      animate(SHRINK_OUT, style({
        width: '0',
        paddingLeft: '0', paddingRight: '0',
        marginLeft: '0', marginRight: '0'
      }))
    ])
  ]),
  transition('void => *', [
    style({opacity: '0'}),
    animate(FADE_IN, style({opacity: '1'}))
  ])
]);
