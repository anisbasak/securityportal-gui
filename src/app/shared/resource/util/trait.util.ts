import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';
import _isEqual from 'lodash-es/isEqual';
import _orderBy from 'lodash-es/orderBy';

import { Resource, Trait } from '@app/core/models';
import { environment } from '@env/environment';
import * as constants from '@app/constants';

/** Used to transport a lat/long pair to specify a location */
export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export class TraitUtil {

  /**
   * Utility algorithm for finding the resource's geo-location centroid.
   * @param resource The resource to be searched.
   * @returns The location data as a lat/long pair
   */
  static location(resource: Resource): GeoLocation {
    const centroid = _find(resource.traits, { rule: constants.GEOJSON_POINT_TRAIT_RULE });
    return centroid
      ? { longitude: centroid.value[0], latitude: centroid.value[1] }
      : null;
  }

  /**
   * Select the most preferred trait. First, allow only active traits.
   * Then look at priorities and take the highest. Lastly, sort by
   * timestamp and select the most recent one.
   */
   static selectTrait(traits: Trait[]): Trait {
    if (traits.length === 1) {
      return traits[0];
    }

    // Select only active traits and sort by priority level
    const activeTraits = _filter(traits, {state: 'Active'});
    const prioritizedTraits = _orderBy(activeTraits, ['priority'], ['desc']);

    let preferredTraits: Trait[] = [];
    if (prioritizedTraits.length) {
      preferredTraits = prioritizedTraits.filter(x => x.priority === prioritizedTraits[0].priority);
    }

    if (preferredTraits.length === 1) {
      return preferredTraits[0];
    }

    // Log a warning if multiple traits have the same priority and different values
    if (!environment.production && preferredTraits.length) {
      const values = preferredTraits.map(t => t.value);

      if (!values.every((v, i, a) => _isEqual(a[0], v))) {
        console.warn('Multiple equal priority traits for', preferredTraits[0].rule, values);
      }

    }

    // Sort by most recent timestamp first
    preferredTraits.sort((a, b) => a.ts > b.ts ? -1 : a.ts < b.ts ? 1 : 0);

    // Return with the most recent trait
    return preferredTraits.length ? preferredTraits[0] : null;
  }
}
