import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-user-parents',
  templateUrl: './info-user-parents.component.html',
  styleUrls: ['./info-user-parents.component.scss']
})
export class InfoUserParentsComponent implements OnInit {

  @Input() userData: any;

  constructor() { }

  ngOnInit(): void {
  }

}
