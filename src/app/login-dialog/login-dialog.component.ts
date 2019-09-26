import { AuthService, AuthResponseData } from "./auth.service";
import { Validators } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogClose
} from "@angular/material/dialog";
import {Observable} from 'rxjs';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: "app-login-dialog",
  templateUrl: "./login-dialog.component.html",
  styleUrls: ["./login-dialog.component.css"]
})
export class LoginDialogComponent implements OnInit {
  constructor(public dialog: MatDialog) {}
  public openDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogOverviewDialog, {
      width: "350px"
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log("The dialog was closed, the result is: ", result);
    // });
  }

  ngOnInit() {}
}

@Component({
  selector: "app-login-dialog-overview-dialog",
  templateUrl: "./login-dialog-overview-dialog.html"
})
export class LoginDialogOverviewDialog implements OnInit {
  isInLoginMode = true;
  public authForm: FormGroup;
  isLoading = false;
  error = null;

  constructor(
    public dialogRef: MatDialogRef<LoginDialogOverviewDialog>,
    private authService: AuthService,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required)
    });
  }
  switchLoginMode() {
    this.isInLoginMode = !this.isInLoginMode;
  }

  authObs: Observable<AuthResponseData>;

  onSubmit(form: FormGroup) {
    console.log("Auth Form: ", form.value);
    const email = form.value.email;
    const password = form.value.password;
    if (this.isInLoginMode) {
      this.authObs = this.authService.login(email, password);
    } else {
      this.isLoading = true;
      this.authObs = this.authService.signup(email, password)
    }

    this.authObs.subscribe(
      responseData => {
        console.log(responseData);
        this.isLoading = false;
        this.dialogRef.close();
        form.reset();
      },
      errorMessage => {
        console.log("Some Error: ", errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
        form.reset();
      }
    );

   
  }
}
