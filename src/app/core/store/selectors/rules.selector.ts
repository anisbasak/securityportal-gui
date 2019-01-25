import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromRules from '../reducers/rules.reducer';

export const getRulesState = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.CoreState) => state.rules
);

// blueprints
export const getBlueprintEntities = createSelector(
  getRulesState,
  fromRules.getBlueprintEntitites,
);

export const getAllBlueprints = createSelector(
  getBlueprintEntities,
  entities => Object.keys(entities).map(name => entities[name])
);

export const getBlueprintsLoaded = createSelector(
  getRulesState,
  fromRules.getBlueprintsLoaded
);

export const getBlueprintsLoading = createSelector(
  getRulesState,
  fromRules.getBlueprintsLoading
);
