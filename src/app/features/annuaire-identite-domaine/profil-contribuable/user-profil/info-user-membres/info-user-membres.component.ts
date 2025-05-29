import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-user-membres',
  templateUrl: './info-user-membres.component.html',
  styleUrls: ['./info-user-membres.component.scss']
})
export class InfoUserMembresComponent implements OnInit {

  @Input() membres: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
