import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { AdminService } from './admin.service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isChecked: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http
      .get<User[]>('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .pipe(
        map((users: User[]) => {
          return users.map((user: User) => ({...user, isChecked: false}))
        })
      )
  }
  
}
