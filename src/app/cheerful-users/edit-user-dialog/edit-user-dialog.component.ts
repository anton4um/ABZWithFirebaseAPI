import { FirebaseService } from "./../firebase.service";
import { CheerfUserService } from "./../cheerf-user.service";
import { UserPosition } from "./../user-models/user-position.model";
import { HttpService } from "./../../shared/http.service";
import { Validators } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import Inputmask from "inputmask";

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
export class EditUserDialogOverviewDialog
  implements OnInit, AfterViewInit, OnDestroy {
  isInLoginMode = true;
  userPositions: UserPosition[] = [];
  public editUserForm: FormGroup;
  isLoading = false;
  error = null;
  user: any;
  startedEdititngUserSub: Subscription;
  userPhotoViewer;
  uploadFileEL: HTMLElement;
  constructor(
    public dialogRef: MatDialogRef<EditUserDialogOverviewDialog>,
    private httpService: HttpService,
    private cheerfulUserService: CheerfUserService,
    private firebaseService: FirebaseService
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
      });
    this.startedEdititngUserSub = this.cheerfulUserService.startedEdititngUser.subscribe(
      user => {
        this.userPhotoViewer = user.photo;
        this.user = user;
        this.editUserForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone
        });
        this.editUserForm.get("position").setValue(user.position);
      }
    );
  }

  async onSubmit() {
    this.isLoading = true;
    let userData: { photo_path: string; photo_url: string } = {
      photo_path: null,
      photo_url: null
    };

    if (this.uploadFileEL["files"][0]) {
      userData = await this.firebaseService.uploadUserFileToFirebase(
        this.uploadFileEL["files"][0]
      );
    }

    let sendUser = {
      id: this.user.id,
      name: this.editUserForm.get("name").value,
      email: this.editUserForm.get("email").value,
      phone: this.editUserForm.get("phone").value,
      photo: (await userData).photo_url,
      photo_path: (await userData).photo_path,
      position: this.editUserForm.get("position").value
    };
    this.cheerfulUserService.endEditingUser.next(sendUser);
    this.editUserForm.reset();
    this.dialogRef.close();
  }

  ngAfterViewInit(): void {
    Inputmask({ mask: "+38(999) 999 99 99" }).mask(
      document.getElementById("phoneUser")
    );
    const self = this;
    this.uploadFileEL = document.getElementById("uploadPhotoEditUser");

    this.uploadFileEL.addEventListener("change", function(event) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target["files"][0]);
      reader.onload = () => {
        self.userPhotoViewer = reader.result as string;
      };
    });
  }
  dialogCencel() {
    this.editUserForm.reset();
    this.dialogRef.close();
  }
  onRemovePhoto() {
    this.firebaseService.onDeleteFile(this.user.photo_path);
    this.userPhotoViewer = "";
  }

  ngOnDestroy() {
    this.startedEdititngUserSub.unsubscribe();
  }
}
