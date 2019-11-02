import { UserDataFormat } from './user-models/user-data-format';
import { User } from "./user-models/user.model";
import { Injectable, OnInit } from "@angular/core";

import {
  AngularFireStorage,
  AngularFireStorageReference
} from "angularfire2/storage";
import * as firebase from "firebase/app";
import "firebase/database";

@Injectable({ providedIn: "root" })
export class FirebaseService implements OnInit {
  constructor(private afStorage: AngularFireStorage) {}

  storageRef: AngularFireStorageReference;

  ngOnInit() {}
  photoData: { photo_path: string; photo_url: string } = {
    photo_path: null,
    photo_url: null
  };
  async uploadUserFileToFirebase(file: File) {
    if (file) {
      this.storageRef = this.afStorage.ref(file.name);
      await this.storageRef.put(file).then(snapshot => {
        // console.log(
        //   "get Snapshot from Firebase while putting the file: ",
        //   snapshot
        // );
      });

      await this.storageRef
        .getMetadata()
        .toPromise()
        .then(meta => {
          this.photoData.photo_path = meta.fullPath;
        });
      await this.storageRef
        .getDownloadURL()
        .toPromise()
        .then(url => {
          this.photoData.photo_url = url;
          // console.log(
          //   "Form data from Promise Url: ",
          //   this.photoData.photo_url,
          //   " full Path: ",
          //   this.photoData.photo_path
          // );
        });
    }

    return this.photoData;
  }

  updateUserEntryInFb(user) {
    firebase
      .database()
      .ref("users/" + user.id)
      .update({
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
        photo_path: user.photo_path,
        position: user.position
      });
  }

  updateUserEntryInUsersArray(user) {
    let retrivedUser: UserDataFormat = null;
  return  firebase
      .database()
      .ref("users/" + user.id)
      .once("value")
    //  .then(snapshot => {
      //  console.log(
        //  "snapshot from read once in update user entrys: ",
         // snapshot.val()
        //);
        //return snapshot
     // });
  }

  onDeleteFile(fileName: string) {
    let ref = this.afStorage.ref(fileName);
    ref.delete();
  }
}
