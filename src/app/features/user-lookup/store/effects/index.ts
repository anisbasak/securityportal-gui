import { FormEffects } from './form.effect';
import { LookupKeysEffects } from './lookup-key.effect';
import { LookupEffects } from './lookup.effect';

export const effects = [
  FormEffects,
  LookupKeysEffects,
  LookupEffects,
];

export * from './form.effect';
export * from './lookup-key.effect';
export * from './lookup.effect';
