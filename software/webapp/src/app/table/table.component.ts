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
        console.log(data);
        this.dataSource = data;
      },
      err => {
        // Error Message
      }
    )
  }

}
