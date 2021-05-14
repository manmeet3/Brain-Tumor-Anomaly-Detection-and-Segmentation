import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['index', 'patientName', 'radiologistName',
  'scanDate', 'processed', 'radiologistComments','email'];
  dataSource;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getScans().subscribe(
      data => {
        this.dataSource = data;
      },
      err => {
        // Error Message
      }
    );
  }

  getModelResults(patient){
    /* API to process patient mri and update database using patient details */
  }

  viewModelResults(patient){
    /* API to get patient's particular mri scan and display it in Nifti viewer */
  }

}
