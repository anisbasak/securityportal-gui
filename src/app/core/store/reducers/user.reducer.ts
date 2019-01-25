import * as fromModels from '../../models';
import * as fromUser from '../actions/user.action';

export interface UserState {
  user: fromModels.CoreUser;
  userLoading: boolean;
  userLoaded: boolean;

  profile: fromModels.ProfileUser;
  profileLoading: boolean;
  profileLoaded: boolean;
}

export const initialState: UserState = {
  user: null,
  userLoading: false,
  userLoaded: false,

  profile: null,
  profileLoading: false,
  profileLoaded: false,
};

export function reducer(
  state = initialState,
  action: fromUser.UserActions,
): UserState {

  switch (action.type) {
    case fromUser.LOAD_USER: {
      return {
        ...state,
        userLoading: true,
      };
    }

    case fromUser.LOAD_USER_SUCCESS: {
      const user = action.payload;
      return {
        ...state,
        user,
        userLoading: false,
        userLoaded: true,
      };
    }

    case fromUser.LOAD_USER_FAIL: {
      return {
        ...state,
        userLoading: false,
        userLoaded: false,
      };
    }

    case fromUser.LOAD_PROFILE_USER: {
      return {
        ...state,
        profileLoading: true,
      };
    }

    case fromUser.LOAD_PROFILE_USER_SUCCESS: {
      const profile = action.payload;
      return {
        ...state,
        profile,
        profileLoading: false,
        profileLoaded: true,
      };
    }

    case fromUser.LOAD_PROFILE_USER_FAIL: {
      return {
        ...state,
        profileLoading: false,
        profileLoaded: false,
      };
    }

    case fromUser.DISCARD_USER: {
      return initialState;
    }
  }

  return state;
}

export const getUser = (state: UserState) => state.user;
export const getUserLoading = (state: UserState) => state.userLoading;
export const getUserLoaded = (state: UserState) => state.userLoaded;

export const getProfile = (state: UserState) => state.profile;
export const getProfileLoading = (state: UserState) => state.profileLoading;
export const getProfileLoaded = (state: UserState) => state.profileLoaded;
