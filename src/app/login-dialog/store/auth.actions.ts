import { Action } from "@ngrx/store";

export const LOGIN_START = "[Auth] Login start";
export const LOGOUT = "[Auth] Logout";
export const AUTHENTICATE_SUCCESS = "[Auth] Login";
export const AUTHENTICATE_FALE = "[Auth] Login fale";
export const SIGNUP_START = "[Auth] SingUp start";
export const AUTO_LOGIN = "[Auth] Auto Login";

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;

  constructor(
    public payload: {
      email: string;
      userId: string;
      token: string;
      expirationDate: Date;
    }
  ) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string; password: string }) {}
}

export class AuthenticateFale implements Action {
  readonly type = AUTHENTICATE_FALE;

  constructor(public payload: string) {}
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START;

    constructor(public payload: { email: string; password: string }){}
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}


export type AuthActions =
  | AuthenticateSuccess
  | Logout
  | LoginStart
  | AuthenticateFale
  | SignupStart
  | AutoLogin;
