import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from './shared/http.service';
import { AdminService } from './shared/admin.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  page = 1;
  pageSize = 10;
  collectionSize: number;
  allUsers: User[] = [];
  userInput!: string;
  userSubscription!: Subscription;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.userSubscription = this.adminService.usersChanged.subscribe(
      ({users, collectionSize}) => {
        console.log('Iam at event emitter: ', users);
        this.allUsers = users;
        this.collectionSize = collectionSize;
      }
    );
    this.allUsers = this.adminService.retrieveUsers();
  }

  onInputChange() {
    this.adminService.filterUsers(this.userInput);
  }

  onDeleteSelected(currentPage: number) {
    this.adminService.deleteSelectedUsers(currentPage);
  }
  
  onPageChange() {
    this.adminService.paginatedUsers(this.page, this.pageSize);
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
