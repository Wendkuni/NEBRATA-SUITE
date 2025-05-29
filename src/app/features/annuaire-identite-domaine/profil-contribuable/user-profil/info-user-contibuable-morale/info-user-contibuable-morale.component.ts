import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-user-contibuable-morale',
  templateUrl: './info-user-contibuable-morale.component.html',
  styleUrls: ['./info-user-contibuable-morale.component.scss']
})
export class InfoUserContibuableMoraleComponent implements OnInit {

  @Input() userData: any;

  constructor() { }

  ngOnInit(): void {
  }

}
