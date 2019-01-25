import * as fromConstants from '../../constants';
import * as fromStore from '../reducers/oauth';

export function remove(): void {
  localStorage.removeItem(fromConstants.OAUTH_STORAGE_KEY);
}

export function set(payload: fromStore.OauthState): void {
  const data = JSON.stringify(payload);
  localStorage.setItem(fromConstants.OAUTH_STORAGE_KEY, data);
}

export function get(): fromStore.OauthState | null {
  const stored = localStorage.getItem(fromConstants.OAUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}
