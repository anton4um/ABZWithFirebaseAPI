import { UserSigne } from "./../user-signe.model";

import * as AuthActions from "./auth.actions";

export interface State {
  user: UserSigne;
  isAuth: boolean;
}
const initialState: State = {
  user: null,
  isAuth: false,
};
export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.LOGIN:
      console.log("Hello from Login");
      const user = new UserSigne(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        user: user,
        isAuth: true,
      };
    case AuthActions.LOGOUT:
        return {
            ...state,
            user: null,
            isAuth: false,
        }  
    default: 
        return state    
  }
}
