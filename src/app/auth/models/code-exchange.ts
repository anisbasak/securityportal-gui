/** Request body format for exchanging a code with a token. */
export interface CodeExchangeRequest {
  grant_type: 'authorization_code';
  client_id: string;
  code: string;
  redirect_uri: string;
}

/** Expected response format from the exchange request. */
export interface CodeExchangeResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

/** Expected response format when an error occurs during code exchange. */
export interface CodeExchangeFailureResponse {
  error: string;
  error_description: string;
}
