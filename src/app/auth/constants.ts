import { environment } from '@env/environment';

const redirectRoot = environment.local ? environment.local.oauthRedirectRoot : '';
const tokenRoot = environment.local ? environment.local.oauthTokenRoot : '';

// routes
export const OAUTH_REDIRECT_URL = `${redirectRoot}/oauth/callback`;
export const OAUTH_AUTHORIZE_URL = `${tokenRoot}/api/oauth2/authorize`;
export const OAUTH_TOKEN_URL = `${tokenRoot}/api/oauth2/token`;
export const OAUTH_TOKEN_REVOKE_URL = `${tokenRoot}/api/oauth2/token/revoke`;
export const OAUTH_TOKEN_INFO_URL = `${tokenRoot}/api/oauth2/token/info`;
export const OAUTH_TOKEN_EXTEND_URL = `${tokenRoot}/api/oauth2/token/extend`;

// oauth2 keys
export const AUTHENTICATION_STORAGE_KEY = 'authentication_state';
export const OAUTH_STORAGE_KEY = 'oauth_state';
export const OAUTH_CLIENT_ID = 'app';

// token information
export const TOKEN_WARNING_TIME_SECONDS = 120; // 2 minutes
