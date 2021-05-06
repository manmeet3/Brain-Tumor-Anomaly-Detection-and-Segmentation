import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { User } from '../../model/user';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.scss']
})
export class BoardAdminComponent implements OnInit {
  public users: User[];
  form: FormGroup;
  checked = false;
  errorMessage = '';
  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      checkArray: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {

    this.getInactiveUsers();
  }

  getInactiveUsers() {
    this.userService.getInactiveUsers().subscribe(
      data => {
        this.users = data;
      },
      err => {
       // this.content = JSON.parse(err.error).message;
      }
    );
  }
  approve() {
   // console.log(this.form.value);
    this.userService.setUsersActive(this.form.value).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
    window.location.reload();
  }

  onCheckboxChange(e) {
    const currentName = e.source._elementRef.nativeElement.innerText;
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;
    if (e.checked) {
      checkArray.push(new FormControl(currentName));
    } else {
      let i = 0;
      checkArray.controls.forEach((item: FormControl) => {
        console.log(name);
        if (item.value === currentName) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
}


// approve() {
//   // const selectedUsers = this.form.value.users
//   //   .map((checked, i) => checked ? this.form.value.users[i].username)
//   //   .filter(v => v !== null);
//   console.log();
// }
//
// onCheckboxChange(e) {
//   const checkArray: FormArray = this.form.get('checkArray') as FormArray;
//
//   if (e.target.checked) {
//     checkArray.push(new FormControl(e.target.value));
//   } else {
//     let i: number = 0;
//     checkArray.controls.forEach((item: FormControl) => {
//       if (item.value == e.target.value) {
//         checkArray.removeAt(i);
//         return;
//       }
//       i++;
//     });
//   }
// }
