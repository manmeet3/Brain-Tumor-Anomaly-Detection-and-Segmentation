import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-technician.component.html',
  styleUrls: ['./board-technician.component.scss'],
})
export class BoardTechnicianComponent implements OnInit {

  images;
  form: any = {
    patientName: null,
    radiologistName: null,
    scanDate: null,
    patientEmail: null,
    mriPath: null
  };
  constructor(private userService: UserService) {
  }

  ngOnInit() {
  }

  selectImage(event){
    if(event.target.files.length>0){
      const file = event.target.files[0];
      this.images = file;
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('patientName',this.form.patientName);
    formData.append('radiologistName',this.form.radiologistName);
    formData.append('scanDate',this.form.scanDate);
    formData.append('patientEmail',this.form.patientEmail);
    formData.append('mriPath',this.images.name);
    formData.append('mriImage',this.images);
    this.userService.createScan(formData).subscribe(
      data => {
      },
      err => {
        // Display Error
        console.log(err);
      }
    );
  }
}
