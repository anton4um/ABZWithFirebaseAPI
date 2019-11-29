import { AuthService } from './login-dialog/auth.service';
import { Component, OnInit } from '@angular/core';

import {Store} from "@ngrx/store";
import * as fromApp from "./store/app.reducer";
import * as AuthActions from "./login-dialog/store/auth.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private store: Store<fromApp.AppState>){}
  title = 'ABZTestTask';

  ngOnInit(){
    // this.authService.autoLogin();
    this.store.dispatch(new AuthActions.AutoLogin());
  }
}
