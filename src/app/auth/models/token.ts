/** Expected response format from the token info request. */
export interface TokenInfoResponse {
  expires_in: number;
}

/** Expected response format from token extend request. */
export interface ExtendTokenResponse {
  expires_in: number;
}
