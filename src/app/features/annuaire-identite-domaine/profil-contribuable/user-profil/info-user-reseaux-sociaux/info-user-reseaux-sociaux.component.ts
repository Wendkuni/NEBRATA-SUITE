import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-user-reseaux-sociaux',
  templateUrl: './info-user-reseaux-sociaux.component.html',
  styleUrls: ['./info-user-reseaux-sociaux.component.scss']
})
export class InfoUserReseauxSociauxComponent implements OnInit {

  @Input() reseauxSociaux: any;

  constructor() {
  
   }

  ngOnInit(): void {
  }

}
