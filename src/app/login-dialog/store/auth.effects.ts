import { UserSigne } from "./../user-signe.model";
import { HttpClient } from "@angular/common/http";
import { switchMap, tap } from "rxjs/operators";
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
  const user = new UserSigne(email, userId, token, expirationDate);
  localStorage.setItem("userData", JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate
  });
};
export const errorHendler = errorRes => {
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

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      localStorage.removeItem("userData");
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
        const userData: {
            id: string;
            email: string;
            _token: string;
            _tokenExpirationDate: string;
          } = JSON.parse(localStorage.getItem("userData"));
          if (!userData) {
            return {type: "DUMMY"};
          }
          const loadedUser = new UserSigne(
            userData.id,
            userData.email,
            userData._token,
            new Date(userData._tokenExpirationDate)
          );
          if (loadedUser.token) {
            // this.user.next(loadedUser);
      
            
            return new AuthActions.AuthenticateSuccess({
                email: loadedUser.email,
                userId: loadedUser.id,
                token: loadedUser.token,
                expirationDate: new Date(userData._tokenExpirationDate)
              })
        
      
            // const exporationTime =
            //   new Date(userData._tokenExpirationDate).getTime() -
            //   new Date().getTime();
            // this.autoLogout(exporationTime);
          }
        return {type: "DUMMY"};  
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
