import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-user-acteur',
  templateUrl: './info-user-acteur.component.html',
  styleUrls: ['./info-user-acteur.component.scss']
})
export class InfoUserActeurComponent implements OnInit {

  @Input() userData: any;

  constructor() { }

  ngOnInit(): void {
  }

}
