import {Action} from '@ngrx/store';
import {UserDataFormat} from '../user-models/user-data-format';

export const EDIT_USER_START = "[EditUser] edit user start";
export const EDIT_USER_END = "[Edit user] Edit user end";

export class editUserStart implements Action {
    readonly type = EDIT_USER_START;
    constructor(public payload: UserDataFormat){}
}

export class editUserEnd implements Action {
    readonly type = EDIT_USER_END;
    constructor(public payload: UserDataFormat){}    
}

export type EditUserActions = editUserStart | editUserEnd;