export interface EnvironmentConfig {
  production: boolean;
  local?: {
    oauthRedirectRoot: string;
    oauthTokenRoot: string;
  };
}
