import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {

  showMRI = false;
  params = [];
  displayedColumns: string[] = ['index', 'patientName', 'radiologistName',
  'scanDate', 'processed', 'radiologistComments','email'];
  dataSource;
  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.userService.getScans().subscribe(
      data => {
        this.dataSource = data;
      },
      err => {
        // Error Message
      }
    );
    this.params["images"] = ["http://localhost:8082/table/Brats17_TCIA_105_1_t1_final.nii.gz"];
  }

  getModelResults(patient){
    /* API to process patient mri and update database using patient details */
    let reqLoad = {
      'scanId': patient._id
    }
    this.userService.getModelResults(reqLoad).subscribe(
      data => {
        this.showMRI = true;
      },
      err => {
        console.log(err);
      }
    )
  }

  viewModelResults(patient){
    /* API to get patient's particular mri scan and display it in Nifti viewer */
    let reqLoad = {
      'scanId': patient._id
    }
    this.userService.viewModelResults(reqLoad).subscribe(
      data => {
        this.showMRI = true;
      },
      err => {
        console.log(err);
      }
    )
  }

}
