import { CheerfUserService } from "./cheerful-users/cheerf-user.service";
import { AngularFireDatabase } from "angularfire2/database";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { AssignmentComponent } from "./assignment/assignment.component";
import { AquaintedComponent } from "./aquainted/aquainted.component";
import { RequirementsComponent } from "./requirements/requirements.component";
import { CheerfulUsersComponent } from "./cheerful-users/cheerful-users.component";
import { HttpService } from "./shared/http.service";
import { HttpClientModule } from "@angular/common/http";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";
import { TextMaskModule } from "angular2-text-mask";
import { IMaskModule } from "angular-imask";
import { FooterComponent } from "./footer/footer.component";
import { AppMainNavComponent } from "./app-main-nav/app-main-nav.component";
import { LayoutModule } from "@angular/cdk/layout";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";

import { MatDialogModule } from "@angular/material/dialog";
import {
  AlertDialogComponent,
  DialogOverviewExampleDialog
} from "./alert-dialog/alert-dialog.component";
import {
  LoginDialogComponent,
  LoginDialogOverviewDialog
} from "./login-dialog/login-dialog.component";
import { LoadingSpinnerComponent } from "./shared/loading-spinner/loading-spinner.component";

import { AngularFireModule } from "angularfire2";
import { AngularFireStorageModule } from "angularfire2/storage";
import {
  EditUserDialogComponent,
  EditUserDialogOverviewDialog
} from "./cheerful-users/edit-user-dialog/edit-user-dialog.component";
import { LoginSpinner } from "./shared/login-spinner/login-spinner.component";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {SnackBarMainComponent, SnackBarComponent} from './shared/snackbar/snack-bar.component';
import {StoreModule} from '@ngrx/store';

import * as fromApp from "./store/app.reducer"

@NgModule({
  declarations: [
    AppComponent,
    AssignmentComponent,
    AquaintedComponent,
    RequirementsComponent,
    CheerfulUsersComponent,
    FooterComponent,
    AppMainNavComponent,
    AlertDialogComponent,
    DialogOverviewExampleDialog,
    LoginDialogComponent,
    LoginDialogOverviewDialog,
    LoadingSpinnerComponent,
    EditUserDialogComponent,
    EditUserDialogOverviewDialog,
    LoginSpinner,
    SnackBarMainComponent,
    SnackBarComponent,
  ],
  entryComponents: [
    DialogOverviewExampleDialog,
    LoginDialogOverviewDialog,
    EditUserDialogComponent,
    EditUserDialogOverviewDialog,
    SnackBarMainComponent,
    SnackBarComponent,
    
  ],
  imports: [
    StoreModule.forRoot(fromApp.appReducer),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    TextMaskModule,
    IMaskModule,
    LayoutModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyA0o7yRSsr6F1TzW19RcPcH_NFAA3s18Dk",
      authDomain: "abztesttask.firebaseapp.com",
      databaseURL: "https://abztesttask.firebaseio.com",
      storageBucket: "abztesttask.appspot.com",
      projectId: "abztesttask",
      messagingSenderId: "1001346095032"
    }),
    AngularFireStorageModule,
  ],
  providers: [HttpService, CheerfUserService],
  bootstrap: [AppComponent]
})
export class AppModule {}
