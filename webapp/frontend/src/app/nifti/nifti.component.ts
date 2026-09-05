import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nifti',
  templateUrl: './nifti.component.html',
  styleUrls: ['./nifti.component.scss'],
})
export class NiftiComponent implements OnInit {
  params = [];
  constructor() {
    this.params["images"] = ["http://localhost:8082/table/Brats17_TCIA_105_1_t1_final.nii.gz"];
   }

  ngOnInit() {}

}
