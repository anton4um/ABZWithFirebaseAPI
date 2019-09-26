import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap, reduce } from "rxjs/operators";
import { throwError, Subject, BehaviorSubject } from "rxjs";
import { UserSigne } from "./user-signe.model";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  user = new BehaviorSubject<UserSigne>(null);
  expirationDurationRef: any;
  constructor(private http: HttpClient) {}

  autoLogin() {
    const userData: {
      id: string;
      email: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      return;
    }
    const loadedUser = new UserSigne(
      userData.id,
      userData.email,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const exporationTime =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(exporationTime);
    }
  }

  public signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA0o7yRSsr6F1TzW19RcPcH_NFAA3s18Dk",
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem("userData");
    clearTimeout(this.expirationDurationRef);
    this.expirationDurationRef = null;
  }

  autoLogout(expirationDuration: any) {
    this.expirationDurationRef = setTimeout(() => {
      this.logout();
    }, expirationDuration);
    console.log(expirationDuration)
  }

  public login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA0o7yRSsr6F1TzW19RcPcH_NFAA3s18Dk",
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  private handleAuthentication(
    email: string,
    localId: string,
    idToken: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new UserSigne(email, localId, idToken, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem("userData", JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = "Unknown Error occurred";
    if (!errorRes.error || !errorRes.error.error.message) {
      return throwError(errorMessage);
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
    return throwError(errorMessage);
  }
}
