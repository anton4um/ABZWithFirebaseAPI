import { OnInit } from '@angular/core';
import { UserDataFormat } from './user-models/user-data-format';
import { Subject, BehaviorSubject } from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class CheerfUserService{
    user: any;
    startedEdititngUser = new BehaviorSubject<UserDataFormat>(null);
    endEditingUser = new BehaviorSubject<UserDataFormat>(null);
}