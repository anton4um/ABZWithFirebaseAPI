import * as fromEditUser from "../cheerful-users/store/edit-user.reducer"
import * as fromAuth from "../login-dialog/store/auth.reducer"

import {ActionReducerMap} from '@ngrx/store';

export interface AppState {
    editUser: fromEditUser.State;
    auth: fromAuth.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    editUser: fromEditUser.EditUserReducer,
    auth: fromAuth.authReducer,
}