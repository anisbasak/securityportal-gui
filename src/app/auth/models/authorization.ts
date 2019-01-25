/** Object to get wrapped into the `state` query param of the authorization request. */
export interface AuthorizationStateParameter {
  nextUrl: string;
  authorizationState: string;
}
