import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromForm from '../reducers/form.reducer';

export const getFormState = createSelector(
  fromFeature.getUserLookupState,
  state => state.form,
);

export const getGeneralField = createSelector(
  getFormState,
  fromForm.getGeneralField,
);

export const getUserFieldMap = createSelector(
  getFormState,
  fromForm.getUserFieldMap,
);

export const getLinkBlueprint = createSelector(
  getFormState,
  fromForm.getLinkBlueprint,
);

export const getLinkFieldMap = createSelector(
  getFormState,
  fromForm.getLinkFieldMap,
);

export const getUserFieldMapActive = createSelector(
  getUserFieldMap,
  fieldMap => Object.keys(fieldMap || {}).length > 0,
);

export const getLinkFieldMapActive = createSelector(
  getLinkBlueprint,
  getLinkFieldMap,
  (blueprint, fieldMap) => !!blueprint && Object.keys(fieldMap || {}).length > 0,
);

export const getFormEmpty = createSelector(
  getGeneralField,
  getUserFieldMapActive,
  getLinkFieldMapActive,
  (generalField, userFieldActive, linkFieldActive) => !generalField && !userFieldActive && !linkFieldActive
);

export const getUserField = (field: string) => {
  return createSelector(
    getUserFieldMap,
    map => map[field],
  );
};

export const getLinkField = (field: string) => {
  return createSelector(
    getLinkFieldMap,
    map => map ? map[field] : null,
  );
};
