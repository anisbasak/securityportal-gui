import { createSelector } from '@ngrx/store';

import { UserGroups } from '../../constants';
import * as fromFeature from '../reducers';
import * as fromUser from '../reducers/user.reducer';

export const getUserState = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.CoreState) => state.user,
);

export const getUser = createSelector(
  getUserState,
  fromUser.getUser,
);

export const getUserLoading = createSelector(
  getUserState,
  fromUser.getUserLoading,
);

export const getUserLoaded = createSelector(
  getUserState,
  fromUser.getUserLoaded,
);

export const getUserRoles = createSelector(
  getUser,
  user => user ? user.roles : [],
);

export const userHasRole = (role: UserGroups) => {
  return createSelector(getUserRoles, roles => roles.includes(role));
};

export const getProfileUser = createSelector(
  getUserState,
  fromUser.getProfile,
);

export const getProfileUserLoading = createSelector(
  getUserState,
  fromUser.getProfileLoading,
);

export const getProfileUserLoaded = createSelector(
  getUserState,
  fromUser.getProfileLoaded,
);
