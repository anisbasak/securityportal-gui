import * as fromModels from '../../models';
import * as fromForm from '../actions/form.action';

export const initialState: fromModels.UserLookupFormState = {
  user: {}
};

export function reducer(
  state = initialState,
  action: fromForm.FormAction,
): fromModels.UserLookupFormState {

  switch (action.type) {
    case fromForm.RESET_FORM: {
      return { user: {} };
    }

    case fromForm.UPDATE_FORM_GENERAL_FIELD: {
      const { general, ...remaining } = state;

      if (action.payload) {
        return { ...remaining, general: action.payload.trim() };
      }

      return remaining;
    }

    case fromForm.UPDATE_FORM_USER_FIELD: {
      const user = applyLookupFieldChange(state.user, action.payload);
      return { ...state, user };
    }

    case fromForm.UPDATE_FORM_LINK_SELECTION: {
      const { blueprint } = action.payload;
      const link = blueprint ? { blueprint, keys: {} } : null;
      return { ...state, link };
    }

    case fromForm.UPDATE_FORM_LINK_FIELD: {
      const linkExists = !!state.link;
      if (linkExists) {
        const keys = applyLookupFieldChange(state.link.keys, action.payload);
        const link = { ...state.link, keys };
        return { ...state, link };
      }
    }
  }

  return state;
}

function applyLookupFieldChange(
  state: fromModels.LookupFieldMap,
  change: fromModels.LookupFieldChange,
): fromModels.LookupFieldMap {
  // Pop any old key from the state
  const { [change.key]: oldValue, ...remaining } = state;

  // Return the state with the removed or updated key
  if (change.value.value == null) {
    return remaining;
  } else {
    return { ...remaining, [change.key]: change.value };
  }
}

export const getGeneralField = (state: fromModels.UserLookupFormState) => state.general;
export const getUserFieldMap = (state: fromModels.UserLookupFormState) => state.user;
export const getLinkBlueprint = (state: fromModels.UserLookupFormState) => state.link ? state.link.blueprint : null;
export const getLinkFieldMap = (state: fromModels.UserLookupFormState) => state.link ? state.link.keys : {};
