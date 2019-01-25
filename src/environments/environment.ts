import { EnvironmentConfig } from './environment-config.model';

export const environment: EnvironmentConfig = {
  production: false,
  local: {
    oauthRedirectRoot: 'http://localhost:4200',
    oauthTokenRoot: 'http://localhost:4201',
  },
};
