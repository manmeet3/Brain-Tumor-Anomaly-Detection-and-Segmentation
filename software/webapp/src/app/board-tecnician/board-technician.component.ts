import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-technician.component.html',
  styleUrls: ['./board-technician.component.scss'],
})
export class BoardTechnicianComponent implements OnInit {

  form: any = {
    patientName: null,
    radiologistName: null,
    scanDate: null,
    patientEmail: null,
    mri: null
  };
  constructor(private userService: UserService) {
  }

  ngOnInit() {
  }

  onSubmit(): void {
    this.userService.createScan(this.form).subscribe(
      data => {
      },
      err => {
        // Show Error message
      }
    );
  }
}
