import { CheerfUserService } from './../cheerf-user.service';
import { CheerfulUsersComponent } from './../cheerful-users.component';
import { UserPosition } from './../user-models/user-position.model';
import { HttpService } from "./../../shared/http.service";
import { Validators } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit, AfterViewInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { Observable } from "rxjs";
import {UserDataFormat} from '../user-models/user-data-format';
import {take, exhaustMap} from 'rxjs/operators';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: "app-edit-user-dialog",
  templateUrl: "./edit-user-dialog.component.html"
})
export class EditUserDialogComponent implements OnInit {
  constructor(public dialog: MatDialog) {}
  public openDialog(): void {
    const dialogRef = this.dialog.open(EditUserDialogOverviewDialog, {
      width: "250px"
    });
  }

  ngOnInit() {}
}

@Component({
  selector: "app-edit-user-dialog-overview-dialog",
  templateUrl: "./edit-user-dialog-overview-dialog.html"
})
export class EditUserDialogOverviewDialog implements OnInit, AfterViewInit {
  
  isInLoginMode = true;
  userPositions: UserPosition[] = [];
  public editUserForm: FormGroup;
  isLoading = false;
  error =  null;
  user: any;

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogOverviewDialog>,
    private httpService: HttpService,
    private cheerfulUserService: CheerfUserService,
  ) {}

  ngOnInit() {
    this.editUserForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl(null, [Validators.required]),
      position: new FormControl(null, [Validators.required])
    });
    this.httpService
      .getUserDataFromUrl("https://abztesttask.firebaseio.com/positions.json")
      .subscribe(positions => {
        this.userPositions = positions as UserPosition[];
        console.log('user Positions from EditDialog: ', this.userPositions);
      });
    this.cheerfulUserService.startedEdititngUser.subscribe(
      user => {
        console.log("Have a CUrrent Users", user);
        this.user = user;
        this.editUserForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
          posiotion: null,
        });
      }
    );
  }

  onSubmit(){
   let sendUser = {
      id: this.user.id,
      name: this.editUserForm.get('name').value,
      email: this.editUserForm.get('email').value,
      phone: this.editUserForm.get('phone').value,
      position: this.editUserForm.get('position').value,
    }
    console.log('Send User: ',sendUser, 'our USER: ',this.user);
    this.cheerfulUserService.endEditingUser.next(sendUser);
    this.editUserForm.reset();
    this.dialogRef.close();
  }

  ngAfterViewInit(): void {
    console.log('Current USER', this.user);
  }
  dialogCencel(){
    this.editUserForm.reset();
    this.dialogRef.close();
  }
}
