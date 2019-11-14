import { UserDataFormat } from "./../cheerful-users/user-models/user-data-format";
import { UserSigne } from "../login-dialog/user-signe.model";
import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from "../login-dialog/auth.service";
import { take, exhaustMap } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";

import * as fromApp from "../store/app.reducer";

@Injectable()
export class HttpService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  postUserDataToUrl(url: string, formData: any) {
    return this.store.select("auth").pipe(
       //this.authService.user.pipe(
      take(1),
      map(authData => {
        return authData.user;
      }),
      exhaustMap((user: UserSigne) => {
        // console.log('User Token with GET: ', user.token, ' Form Data: ', formData);
        return this.http.post(url, formData, {
          params: new HttpParams().set("auth", user.token)
        });
      })
    );
  }

  getUserDataFromUrl(url) {
    return this.store.select("auth").pipe(
       //this.authService.user.pipe(
      take(1),
      map(authData => authData.user),
      exhaustMap((user: UserSigne) => {
        // console.log('Searchig for ID Token: ', user);
        return this.http.get(url, {
          params: new HttpParams().set("auth", user.token)
        });
      })
    );
  }
}
