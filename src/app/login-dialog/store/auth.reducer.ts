import { UserSigne } from "./../user-signe.model";


import * as AuthActions from "./auth.actions";

export interface State {
  user: UserSigne;
  authError: string;
  isLoading: boolean;
}
const initialState: State = {
  user: null,
  authError: null,
  isLoading: false,
};
export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
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
        isLoading: false,
      };
    case AuthActions.LOGOUT:
        return {
            ...state,
            user: null,
        }  
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
        return {
            ...state,
            authError: null,
            isLoading: true,
        }    
    case AuthActions.AUTHENTICATE_FALE: 
        return {
            ...state,
            authError: action.payload,
            isLoading: false,
        }    
    default: 
        return state    
  }
}
