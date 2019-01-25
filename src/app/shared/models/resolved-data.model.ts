import { Observable } from 'rxjs';

export interface ResolvedData {
  name: string;
  value: Observable<any>;
}

// Validator for ResolvedData
// ** NOTE **: please keep the validator and interface in-sync
const validProperties = ['name', 'value'];
export function isResolvedData(obj: ResolvedData): boolean {
  if (typeof obj !== 'object') { return false; }
  if (!obj) { return false; }
  return (
    Object.getOwnPropertyNames(obj).every(p => validProperties.includes(p))
    && typeof obj.name === 'string'
    && typeof obj.value === 'object'
  );
}
