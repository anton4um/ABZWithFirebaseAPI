import { Injectable, OnInit } from "@angular/core";

import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
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
  onDeleteFile(fileName: string) {
    let ref = this.afStorage.ref(fileName);
    ref.delete();
  }
}
