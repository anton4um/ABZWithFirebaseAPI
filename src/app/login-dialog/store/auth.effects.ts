import { HttpClient } from "@angular/common/http";
import { switchMap } from "rxjs/operators";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { map, catchError } from "rxjs/operators";
import { of } from "rxjs";

import * as AuthActions from "./auth.actions";
import { Injectable } from "@angular/core";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

export const authenticationHendler = (
  expiresIn: string,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);

  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate
  });
};
export const errorHendler = (errorRes) => {
    let errorMessage = "Unknown Error occurred";
            if (!errorRes.error || !errorRes.error.error.message) {
              return of(new AuthActions.AuthenticateFale(errorMessage));
            }
            switch (errorRes.error.error.message) {
              case "EMAIL_EXISTS":
                errorMessage = "This Email Already Exists";
                break;
              case "INVALID_PASSWORD":
                errorMessage = "Password is wrong";
                break;
              case "USER_DISABLED":
                errorMessage = "This user was disabled";
            }
            return of(new AuthActions.AuthenticateFale(errorMessage));
};

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupEffect: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>(
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA0o7yRSsr6F1TzW19RcPcH_NFAA3s18Dk",
          {
            email: signupEffect.payload.email,
            password: signupEffect.payload.password,
            returnSecureToken: true
          }
        )
        .pipe(
          map(responseData => {
           return authenticationHendler(
              responseData.expiresIn,
              responseData.email,
              responseData.localId,
              responseData.idToken
            );
          }),
          catchError(errorRes => {
            return errorHendler(errorRes);
          })
        );
    })
  );

  @Effect()
  authSub = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA0o7yRSsr6F1TzW19RcPcH_NFAA3s18Dk",
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }
        )
        .pipe(
          map(responseData => {
            const expirationDate = new Date(
              new Date().getTime() + +responseData.expiresIn * 1000
            );

            return new AuthActions.AuthenticateSuccess({
              email: responseData.email,
              userId: responseData.localId,
              token: responseData.idToken,
              expirationDate: expirationDate
            });
          }),
          catchError(errorRes => {
            let errorMessage = "Unknown Error occurred";
            if (!errorRes.error || !errorRes.error.error.message) {
              return of(new AuthActions.AuthenticateFale(errorMessage));
            }
            switch (errorRes.error.error.message) {
              case "EMAIL_EXISTS":
                errorMessage = "This Email Already Exists";
                break;
              case "INVALID_PASSWORD":
                errorMessage = "Password is wrong";
                break;
              case "USER_DISABLED":
                errorMessage = "This user was disabled";
            }
            return of(new AuthActions.AuthenticateFale(errorMessage));
          })
        );
    })
  );
  constructor(private actions$: Actions, private http: HttpClient) {}
}
