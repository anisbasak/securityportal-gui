import { LocationEffects } from './location.effect';
import { RouterEffects } from './router.effect';

export const effects = [
  RouterEffects,
  LocationEffects
];

export * from './location.effect';
export * from './router.effect';
