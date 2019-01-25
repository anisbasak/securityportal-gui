import { EnvironmentConfig } from './environment-config.model';

export const environment: EnvironmentConfig = {
  production: false,
  local: {
    oauthRedirectRoot: 'http://localhost:4200',
    oauthTokenRoot: 'https://security.ehps.ncsu.edu',
  },
};
