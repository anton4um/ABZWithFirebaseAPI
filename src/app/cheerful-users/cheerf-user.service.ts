import { OnInit } from '@angular/core';
import { UserDataFormat } from './user-models/user-data-format';
import { Subject, BehaviorSubject } from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class CheerfUserService{
    user: any;
    startedEdititngUser = new BehaviorSubject<UserDataFormat>(null);
    endEditingUser = new Subject<UserDataFormat>();
    // ngOnInit(){
    //     this.startedEdititngUser.subscribe(user => {
    //         console.log('Current USER 2: ', this.user)
    //         this.user = user    
    //     });
    // }
    // getUser(){
    //     console.log('Current USER', this.user);
    //     return this.user;
    // }
}