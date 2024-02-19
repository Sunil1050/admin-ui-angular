import { Injectable } from '@angular/core';
import { HttpService, User } from './http.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  users: User[] = [];
  collectionSize: number;
  usersChanged = new Subject<{ users: User[]; collectionSize: number }>();
  isAllUSersChecked: boolean = false;
  checkedUsersChange = new Subject<boolean>();

  constructor(private httpService: HttpService) {
    this.fetchUsers();
  }

  fetchUsers() {
    this.httpService.getUsers().subscribe((users: User[]) => {
      console.log('HTTP response: ', users);
      this.users = users;
      this.collectionSize = users.length;
      this.paginatedUsers(1, 10);
    });
  }

  retrieveUsers() {
    return this.users.slice();
  }

  paginatedUsers(currentPage: number, pageSize: number) {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = currentPage * pageSize;
    const paginatedUsers = this.users.slice(startIndex, endIndex);
    this.usersChanged.next({
      users: paginatedUsers,
      collectionSize: this.collectionSize,
    });
  }

  filterUsers(filterString: string) {
    console.log('Filter string: ', filterString);
    if (filterString === '') {
      console.log('Im here');
      this.users = this.retrieveUsers();
      console.log(this.users);
    } else {
      const filteredUsers = this.users.filter(
        (user) =>
          user.name.toLowerCase().includes(filterString.toLowerCase()) ||
          user.email.toLowerCase().includes(filterString.toLowerCase()) ||
          user.role.toLowerCase().includes(filterString.toLowerCase())
      );
      this.users = filteredUsers;
    }

    this.usersChanged.next({
      users: this.users.slice(),
      collectionSize: this.users.length,
    }); // Notify all subscribers of the change
  }

  deleteUser(userId: string, currentPage: number) {
    const result = this.users.filter((user) => user.id !== userId);
    this.users = result;
    this.collectionSize = result.length;
    this.paginatedUsers(currentPage, 10);
  }

  deleteSelectedUsers(currentPage: number) {
    const filteredUsers = this.users.filter((user) => !user.isChecked);
    this.users = filteredUsers;
    this.collectionSize = filteredUsers.length;
    this.checkedUsersChange.next(false);
    this.paginatedUsers(currentPage, 10);
  }

  editUsers(name: string, email: string, role: string, userId: string, currentPage: number) {
    if (name || email || role) {
      const editableUsers = this.users.map((user) => {
        if (user.id === userId) {
          return { ...user, name, email, role };
        }
        return user;
      });
      this.users = editableUsers;
      this.collectionSize = editableUsers.length;
      this.paginatedUsers(currentPage, 10)
    }
  }

  checkedUsers(isChecked: boolean, userId: string, currentPage: number) {
    const updatedUsers = this.users.map((user) => {
      if (user.id === userId) {
        return { ...user, isChecked: isChecked };
      }
      return user;
    });
    this.users = updatedUsers;
    this.collectionSize = updatedUsers.length;
    this.paginatedUsers(currentPage,10)
  }

  allCheckedUsers(checkStatus: boolean, currentPage: number) {
    this.isAllUSersChecked = checkStatus;
    console.log('All users checked at service: ', this.isAllUSersChecked);
    const allCheckedUsers = this.users.map((user, index) => {
      const startIndex = (currentPage - 1) * 10
      const endIndex = currentPage * 10
      if ( index >= startIndex && index <= endIndex) {
        user.isChecked = checkStatus
        return user
      }
      return user

    });
    this.users = allCheckedUsers;
    this.collectionSize = allCheckedUsers.length;
    this.paginatedUsers(currentPage, 10);
  }
}
