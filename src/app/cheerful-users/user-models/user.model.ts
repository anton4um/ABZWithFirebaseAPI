import {Timestamp} from 'rxjs';

export class User {
  public id: number;
  public name: string;
  public email: string;
  public phone: string;
  public photo: string;
  public position: string;
  public position_id: number;
  public token?: string;
  public registration_timestamp?: Timestamp<any>;

  constructor(id: number,
              name: string,
              email: string,
              phone: string,
              photo: string,
              position: string,
              position_id: number,
              token?: string,
              registration_timestamp?: Timestamp<any>,
  ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.photo = photo;
        this.position = position;
        this.position_id = position_id;
        this.token = token,
        this.registration_timestamp = registration_timestamp;
  }
}
