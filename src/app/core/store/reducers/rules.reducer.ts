import * as fromModels from '../../models';
import * as fromRules from '../actions/rules.action';

export interface RulesState {
  blueprintEntities: { [name: string]: fromModels.Blueprint };
  blueprintsLoaded: boolean;
  blueprintsLoading: boolean;
}

export const initialState: RulesState = {
  blueprintEntities: {},
  blueprintsLoaded: false,
  blueprintsLoading: false,
};

export function reducer(
  state = initialState,
  action: fromRules.RulesAction
): RulesState {

  switch (action.type) {
    case fromRules.LOAD_BLUEPRINTS: {
      return {
        ...state,
        blueprintsLoading: true,
      };
    }

    case fromRules.LOAD_BLUEPRINTS_FAIL: {
      return {
        ...state,
        blueprintsLoading: false,
        blueprintsLoaded: false,
      };
    }

    case fromRules.LOAD_BLUEPRINTS_SUCCESS: {
      const blueprints = action.payload;
      const blueprintEntities = blueprints.reduce(
        (entities: { [name: string]: fromModels.Blueprint }, blueprint) => {
          return { ...entities, [blueprint.name]: blueprint };
        },
        { ...state.blueprintEntities }
      );

      return {
        ...state,
        blueprintEntities,
        blueprintsLoaded: true,
        blueprintsLoading: false,
      };
    }

  }

  return state;
}

export const getBlueprintsLoading = (state: RulesState) => state.blueprintsLoading;
export const getBlueprintsLoaded = (state: RulesState) => state.blueprintsLoaded;
export const getBlueprintEntitites = (state: RulesState) => state.blueprintEntities;
