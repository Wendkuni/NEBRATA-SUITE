import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-user-indivision',
  templateUrl: './info-user-indivision.component.html',
  styleUrls: ['./info-user-indivision.component.scss']
})
export class InfoUserIndivisionComponent implements OnInit {

  @Input() userData: any;

  constructor() { }

  ngOnInit(): void {
  }

}
