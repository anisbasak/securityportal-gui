import * as fromConstants from '../../constants';

export interface AuthenticationStateStore {
  token: string;
}

export function remove(): void {
  localStorage.removeItem(fromConstants.AUTHENTICATION_STORAGE_KEY);
}

export function set(payload: AuthenticationStateStore): void {
  const data = JSON.stringify(payload);
  localStorage.setItem(fromConstants.AUTHENTICATION_STORAGE_KEY, data);
}

export function get(): AuthenticationStateStore | null {
  const stored = localStorage.getItem(fromConstants.AUTHENTICATION_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  const parsed = JSON.parse(stored);

  return { token: parsed.token };
}
