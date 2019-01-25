import { ApiEffects } from './api.effect';
import { LoadingEffects } from './loading.effect';
import { MenuEffects } from './menu.effect';
import { RulesEffects } from './rules.effect';
import { UserEffects } from './user.effects';

export const effects = [
  ApiEffects,
  LoadingEffects,
  MenuEffects,
  RulesEffects,
  UserEffects,
];

export * from './api.effect';
export * from './loading.effect';
export * from './menu.effect';
export * from './rules.effect';
export * from './user.effects';
