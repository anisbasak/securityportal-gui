import { createSelector } from '@ngrx/store';
import _find from 'lodash-es/find';
import _filter from 'lodash-es/filter';

import * as constants from '@app/constants';
import * as fromFeature from '../reducers';
import * as fromApi from '../reducers/api.reducer';

export const getApiState = createSelector(
  fromFeature.getCoreState,
  state => state.api,
);

export const getApiVersion = createSelector(
  getApiState,
  fromApi.getVersion,
);

export const getApiOptions = createSelector(
  getApiState,
  fromApi.getOptions,
);

export const getSystemNameOptionTraits = createSelector(
  getApiOptions,
  options => {
    const option = _find(options, { name: constants.SYSTEM_NAME_RESOURCE_NAME });
    return option ? _filter(option.traits, { rule: constants.OPTION_TRAIT_RULE }) : [];
  },
);

export const getFullSiteTitle = createSelector(
  getSystemNameOptionTraits,
  optionTraits => {
    const longestTraitValue = optionTraits.reduce((longest, curr) => {
      const currValue: string = curr.value.toString();
      return currValue.length > longest.length ? currValue : longest;
    }, '');

    return longestTraitValue;
  },
);

export const getShortSiteTitle = createSelector(
  getSystemNameOptionTraits,
  optionTraits => {
    const shortestTraitValue = optionTraits.reduce((shortest, curr) => {
      const currValue: string = curr.value.toString();
      if (!shortest) {
        return currValue;
      } else {
        return currValue.length < shortest.length ? currValue : shortest;
      }
    }, '');

    return shortestTraitValue;
  },
);

