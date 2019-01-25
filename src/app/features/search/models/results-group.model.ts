import { Resources } from '@app/core/models';

/** Group of resources sharing the same resource blueprint. */
export interface ResultsGroup {
  blueprint: string;
  resources: Resources;
}
