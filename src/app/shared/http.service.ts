import { UserDataFormat } from './../cheerful-users/user-models/user-data-format';
import { UserSigne } from "../login-dialog/user-signe.model";
import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from "../login-dialog/auth.service";
import { take, exhaustMap } from "rxjs/operators";

@Injectable()
export class HttpService implements OnInit {
  constructor(private http: HttpClient, private authService: AuthService) {}
  ngOnInit() {}
  postUserDataToUrl(url: string, formData: any) {
  return this.authService.user.pipe(
      take(1),
      exhaustMap((user: UserSigne) => {
        // console.log('User Token with GET: ', user.token, ' Form Data: ', formData);
        return this.http.post(
          url,
          formData,
          {
            params: new HttpParams().set("auth", user.token)
          }
        );
      })
    );
  }

  getUserDataFromUrl(url) {
   return this.authService.user.pipe(
      take(1),
      exhaustMap((user: UserSigne) => {
        // console.log('Searchig for ID Token: ', user);
        return this.http.get(url, {
          params: new HttpParams().set("auth", user.token)
        });
      })
    );
  }
}
