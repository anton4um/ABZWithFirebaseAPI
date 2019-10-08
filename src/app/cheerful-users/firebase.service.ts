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
   photoData: {photo_path: string, photo_url: string} = {'photo_path': 'path', 'photo_url': 'url'};
//   formPhotoData = new FormData();
  async uploadUserFileToFirebase(file: File) {
    //:{photo_path: string, photo_url: string}{
    this.storageRef = this.afStorage.ref(file.name);
    await this.storageRef.put(file).then(snapshot => {
      console.log(
        "get Snapshot from Firebase while putting the file: ",
        snapshot
      );

    //   let photoData: { photo_path: string; photo_url: string } = {
    //     photo_path: "path",
    //     photo_url: "url"
    //   };

    //   console.log(
    //     "BEFORE RETURN Form data from Promise Url: ",
    //     this.photoData.photo_url,
    //     this.photoData.photo_path
    //   );
    });

   await this.storageRef
      .getMetadata()
      .toPromise()
      .then(meta => {
        this.photoData.photo_path = meta.fullPath;
        // photoData.photo_path = meta.fullPath;
        // console.log('get Photo_Path from MetaData: ', photoData.photo_path);
      });
   await this.storageRef
      .getDownloadURL()
      .toPromise()
      .then(url => {
        this.photoData.photo_url = url;
        // photoData.photo_url = url;
        // console.log('get Photo_Url from getDownloadUrl: ', photoData.photo_url);
        console.log(
          "Form data from Promise Url: ",
          this.photoData.photo_url,
          " full Path: ",
          this.photoData.photo_path
        );
      });
  return this.photoData
  }
  onDeleteFile(fileName: string){
      let ref = this.afStorage.ref(fileName);
      ref.delete();
  }
}
