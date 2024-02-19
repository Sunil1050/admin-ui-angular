import {
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from '../shared/http.service';
import { AdminService } from '../shared/admin.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
})
export class UserItemCOmponent implements OnInit {
  @Input() users: User[];
  @Input() currentPage: number;
  isAllChecked: boolean;

  closeResult = '';
  editForm: FormGroup;

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.adminService.checkedUsersChange.subscribe(
      (isChecked) => {
        this.isAllChecked = isChecked
      }
    )
    // this.isAllChecked = this.adminService.isAllUSersChecked;
    this.editForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      role: new FormControl(null, Validators.required),
    });
  }

  onSubmit(userId: string) {
    const { name, email, role } = this.editForm.value;
    this.adminService.editUsers(name, email, role, userId, this.currentPage);
  }

  onDeleteUser(id: string) {
    this.adminService.deleteUser(id, this.currentPage);
  }

  onCheckUser(event: any, userId: string) {
    this.adminService.checkedUsers(event.target.checked, userId, this.currentPage);
  }

  allChecked() {
    // console.log('All checked: ', this.isAllChecked);
    this.adminService.allCheckedUsers(this.isAllChecked, this.currentPage);
  }

  open(content: any, user: User) {
    this.editForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
