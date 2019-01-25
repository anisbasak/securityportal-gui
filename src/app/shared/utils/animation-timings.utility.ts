// Mobile
const xsmallTiming = '300ms';
const xsmallTimingFullScreen = '375ms';
const xsmallTimingEnterScreen = '225ms';
const xsmallTimingExitScreen = '195ms';

// Tablet (30% longer than mobile)
const smallTiming = '390ms';
const smallTimingFullScreen = '488ms';
const smallTimingEnterScreen = '296ms';
const smallTimingExitScreen = '254ms';

// Desktop (always faster)
const desktopTiming = '175ms';
const desktopTimingFullScreen = '200ms';
const desktopTimingEnterScreen = '160ms';
const desktopTimingExitScreen = '150ms';

const standardCurve = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
const decelerationCurve = 'cubic-bezier(0.0, 0.0, 0.2, 1)';
const accelerationCurve = 'cubic-bezier(0.4, 0.0, 1, 1)';
const sharpCurve = 'cubic-bezier(0.4, 0.0, 0.6, 1)';

export const TIMING = {
  xsmall: {
    standard: xsmallTiming,
    fullScreen: xsmallTimingFullScreen,
    enterScreen: xsmallTimingEnterScreen,
    exitScreen: xsmallTimingExitScreen
  },
  small: {
    standard: smallTiming,
    fullScreen: smallTimingFullScreen,
    enterScreen: smallTimingEnterScreen,
    exitScreen: smallTimingExitScreen
  },
  desktop: {
    standard: desktopTiming,
    fullScreen: desktopTimingFullScreen,
    enterScreen: desktopTimingEnterScreen,
    exitScreen: desktopTimingExitScreen
  }
};

export const CURVE = {
  standard: standardCurve,
  deceleration: decelerationCurve,
  acceleration: accelerationCurve,
  sharp: sharpCurve
};
