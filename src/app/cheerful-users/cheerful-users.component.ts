import { CheerfUserService } from "./cheerf-user.service";
import { UserDataFormat } from "./user-models/user-data-format";
import { AuthService } from "./../login-dialog/auth.service";
import { AlertDialogComponent } from "./../alert-dialog/alert-dialog.component";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
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
import { EditUserDialogComponent } from "./edit-user-dialog/edit-user-dialog.component";

declare var $: any;
@Component({
  selector: "app-cheerful-users",
  templateUrl: "./cheerful-users.component.html",
  styleUrls: ["./cheerful-users.component.css"]
})
export class CheerfulUsersComponent implements OnInit, AfterViewInit {
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


  public uploadFileEl: HTMLElement;
  public signupForm: FormGroup;

  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private afStorage: AngularFireStorage,
    private cheerfulUserService: CheerfUserService
  ) {}

  ngOnInit() {
    this.authService.user.subscribe(user => {
      if (user) {
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
                position: response[key].position
              });
            }
            // console.log(this.users);
          });
        this.httpService
          .getUserDataFromUrl(this.url_positions)
          .subscribe(response => {
            // console.log(
            //   "Response of User Positions from Fire Base: ",
            //   response
            // );
            for (let key in response) {
              this.userPositions.push(response[key]);
            }
            // console.log("Positions from the Response: ", this.userPositions);
          });
      }
    });

    this.cheerfulUserService.endEditingUser.subscribe(user => {
      if(user){
        console.log("End of user Editing: ", user);
        firebase
          .database()
          .ref("users/" + user.id)
          .update({ 'name': user.name,
                    'email': user.email,
                    'phone': user.phone,
                    'position': user.position
                  });
      this.users[this.currentUserIndex].name = user.name;
      this.users[this.currentUserIndex].email = user.email;
      this.users[this.currentUserIndex].phone = user.phone;
      this.users[this.currentUserIndex].position = user.position;
      }
    });

    this.signupForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl("", [Validators.required /*this.phoneValidator*/]),
      position: new FormControl(null, Validators.required),
      upload: new FormControl(null, [
        Validators.required
        //this.uploadFileValidator.bind(this)
      ]),
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
      console.log("Event elemnt target: ", event);
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

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: number;
  imageUploadURL: string;
  phoneClearValue: string;

  uploadDataToFirebase() {
    const id = Math.random()
      .toString(36)
      .substring(2);
    const file = this.uploadFileEl["files"][0];
    this.ref = this.afStorage.ref(id);

    this.ref
      .put(file)
      .then(snapshot => {
        this.uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      })
      .then(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.httpService
            .postUserDataToUrl(this.url_users, {
              name: this.signupForm.get("username").value,
              email: this.signupForm.get("email").value,
              phone: this.phoneClearValue,
              photo: url,
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
                      console.log("snap from firebase: ", snap);
                      this.users.push(snap.val());
                    });
                  this.dialog.openDialog();
                }
              },
              error => {
                console.log("Unknown Error Happened!!!", error);
              }
            );
        });
      });
  }
  promise = new Promise<any>(resolve => {
    return resolve("anonimus function in OnEdit function");
  });
  onEditUser(index: number) {
    this.currentUserIndex = index;
    this.promise
      .then(() => {
        this.cheerfulUserService.startedEdititngUser.next(this.users[index]);
        console.log("NEXT Method is reached");
      })
      .then(() => {
        console.log("Diealog is opened");
        this.editUserDialog.openDialog();
      });
  }

  onSubmit() {
    if (this.signupForm.get("phone").valid) {
      this.phoneClearValue = this.signupForm
        .get("phone")
        .value.replace("(", "")
        .replace(")", "")
        .replace(/\s+/g, "");
    }
    this.uploadDataToFirebase();
  }
}
