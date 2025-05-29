import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-user-contibuable-physique',
  templateUrl: './info-user-contibuable-physique.component.html',
  styleUrls: ['./info-user-contibuable-physique.component.scss']
})
export class InfoUserContibuablePhysiqueComponent implements OnInit {

  @Input() userData: any;

  constructor() { }

  ngOnInit(): void {
  }

}
