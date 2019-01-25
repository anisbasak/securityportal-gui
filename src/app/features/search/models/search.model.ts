import { LatLngBounds} from '@agm/core';
import { BlueprintOption } from './model-option.model';
import { DateSearch } from './date-search.model';

/**
 * Metadata surrounding the location search. Primarily used to
 * rebuild the search form.
 */
interface LocationSearchMeta {
  bounds?: LatLngBounds;
}

export interface TextSearch {
  string: string;
  verbatim?: boolean;
}

export interface LocationSearch {
  point: [number, number];
  max?: number;
  min?: number;
  meta?: LocationSearchMeta;
}

export interface Search {
  blueprints: BlueprintOption[];
  text?: TextSearch;
  date?: DateSearch;
  location?: LocationSearch;
}
