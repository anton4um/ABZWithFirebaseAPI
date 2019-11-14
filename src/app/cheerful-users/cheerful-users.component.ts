import { exhaustMap, switchMap, map, take } from "rxjs/operators";
import { CheerfUserService } from "./cheerf-user.service";
import { UserDataFormat } from "./user-models/user-data-format";
import { AuthService } from "./../login-dialog/auth.service";
import { AlertDialogComponent } from "./../alert-dialog/alert-dialog.component";
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy
} from "@angular/core";
import { HttpService } from "../shared/http.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserPosition } from "./user-models/user-position.model";
import Inputmask from "inputmask";
import { __values } from "tslib";
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from "angularfire2/storage";
import * as firebase from "firebase/app";
import "firebase/database";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { EditUserDialogComponent } from "./edit-user-dialog/edit-user-dialog.component";
import { FirebaseService } from "./firebase.service";
import * as fromApp from "../store/app.reducer";
import * as EditUserActions from "../cheerful-users/store/edit-user.actions";
import { UserSigne } from "../login-dialog/user-signe.model";

declare var $: any;
@Component({
  selector: "app-cheerful-users",
  templateUrl: "./cheerful-users.component.html",
  styleUrls: ["./cheerful-users.component.css"]
})
export class CheerfulUsersComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(AlertDialogComponent, { static: false })
  public dialog: AlertDialogComponent;
  @ViewChild(EditUserDialogComponent, { static: false })
  public editUserDialog: EditUserDialogComponent;

  url_users: string = "https://abztesttask.firebaseio.com/users.json";
  url_positions: string = "https://abztesttask.firebaseio.com/positions.json";
  users: UserDataFormat[] = [];
  next_url: string;
  prev_url: string;
  userPositions: UserPosition[] = [];
  currentUserIndex: number;
  endEditUserSub: Subscription;

  uploadFileEl: HTMLElement;
  signupForm: FormGroup;

  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private afStorage: AngularFireStorage,
    private cheerfulUserService: CheerfUserService,
    private firebaseService: FirebaseService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    // this.authService.user.subscribe(user => {
    this.store
      .select("auth")
      .pipe(
        map(authData => {
          console.log("authData from select auth: ", authData);
          return authData.user;
        })
      )
      .subscribe(user => {
        if (user) {
          this.users = [];
          this.httpService
            .getUserDataFromUrl(this.url_users)
            .subscribe(response => {
              // console.log("Response Users from firebase: ", response);
              for (let key in response) {
                // console.log('Key: ',key ,'response with key', response[key]);
                this.users.push({
                  id: key,
                  name: response[key].name,
                  email: response[key].email,
                  phone: response[key].phone,
                  photo: response[key].photo,
                  photo_path: response[key].photo_path,
                  position: response[key].position
                });
              }
              // console.log(this.users);
            });
          this.httpService
            .getUserDataFromUrl(this.url_positions)
            .subscribe(response => {
              for (let key in response) {
                this.userPositions.push(response[key]);
              }
            });
        }
      });

    this.endEditUserSub = this.store
      .select("editUser")
      .pipe(
        map(editUserData => {
          console.log("select edit user: ", editUserData);
          return editUserData.user;
        })
      )
      .subscribe(user => {
        console.log("subscribe in editUser user: ", user);
        if (user) {
          this.firebaseService.updateUserEntryInFb(user);

          this.firebaseService
            .updateUserEntryInUsersArray(user)
            .then(snapshot => {
              this.users[this.currentUserIndex] = snapshot.val();
            });
        }
      });

    this.signupForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl("", [Validators.required /*this.phoneValidator*/]),
      position: new FormControl(null, Validators.required),
      upload: new FormControl(null, [Validators.required]),
      pathToFileUpload: new FormControl(null, Validators.required)
    });
  }

  ngAfterViewInit() {
    const self = this;
    Inputmask({ mask: "+38(999) 999 99 99" }).mask(
      document.getElementById("phone")
    );
    this.uploadFileEl = document.getElementById("upload");
    this.uploadFileEl.addEventListener("change", function(event: Event) {
      // console.log("Event elemnt target: ", event);
      if (self.signupForm.get("upload").valid) {
        self.signupForm
          .get("pathToFileUpload")
          .setValue(event.target["files"][0].name);
      } else {
        self.signupForm.get("pathToFileUpload").markAsTouched();
      }
    });
  }

  // uploadFileValidator(control: FormControl): { [s: string]: boolean } {
  //   const el = document.getElementById("upload");
  //   if (
  //     el["files"].length === 0 &&
  //     (el["files"][0].size > 5242880 ||
  //       el["files"][0].type.indexOf("png") === -1)
  //   ) {
  //     return { invalidPhoto: true };
  //   } else {
  //     return null;
  //   }
  // }
  // file = this.uploadFileEl["files"][0];

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: number;
  imageUploadURL: string;

  async uploadDataToFirebase() {
    let file = this.uploadFileEl["files"][0];
    let photoData: any;
    photoData = await this.firebaseService.uploadUserFileToFirebase(file);

    if (photoData.photo_url) {
      this.httpService
        .postUserDataToUrl(this.url_users, {
          name: this.signupForm.get("username").value,
          email: this.signupForm.get("email").value,
          phone: this.signupForm.get("phone").value,
          photo: photoData.photo_url,
          photo_path: photoData.photo_path,
          position: this.signupForm.get("position").value
        })
        .subscribe(
          response => {
            if (response) {
              console.log("Response was succeed!!!", response);
              firebase
                .database()
                .ref("users/" + response["name"])
                .on("value", snap => {
                  //console.log("snap from firebase: ", snap);
                  this.users.push(snap.val());
                });
              this.dialog.openDialog();
              this.signupForm.reset();
            }
          },
          error => {
            console.log(
              "Unknown Error Happened in posting data user to the Firebase!!!",
              error
            );
          }
        );
    }
  }
  onEditUser(index: number) {
    this.currentUserIndex = index;
    // this.cheerfulUserService.startedEdititngUser.next({ ...this.users[index] });
    this.store.dispatch(
      new EditUserActions.editUserStart({ ...this.users[index] })
    );
    this.editUserDialog.openDialog();
  }

  onSubmit() {
    if (!this.signupForm.valid) {
      return;
    }
    this.uploadDataToFirebase();
  }

  ngOnDestroy() {
    this.endEditUserSub.unsubscribe();
  }
}
