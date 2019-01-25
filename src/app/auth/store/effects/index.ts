import { AuthenticationEffects } from './authentication.effect';
import { OauthEffects } from './oauth.effect';

export const effects = [
  AuthenticationEffects,
  OauthEffects,
];

export * from './authentication.effect';
export * from './oauth.effect';
