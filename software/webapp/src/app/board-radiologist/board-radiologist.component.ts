import { Component, OnInit } from '@angular/core';
import { ModeratorService } from '../services/moderator.service';

@Component({
  selector: 'app-board-radiologist',
  templateUrl: './board-radiologist.component.html',
  styleUrls: ['./board-radiologist.component.scss'],
})
export class BoardRadiologistComponent implements OnInit {

  allPatients;
  isClicked = false;
  constructor(private moderatorService: ModeratorService) { }

  ngOnInit() {
    this.moderatorService.getPatients().subscribe(
      data=>{
        this.allPatients = data;
      },
      err=>{
      }
    )
  }

  onClick(patient){
    this.isClicked = true;
  }

}
