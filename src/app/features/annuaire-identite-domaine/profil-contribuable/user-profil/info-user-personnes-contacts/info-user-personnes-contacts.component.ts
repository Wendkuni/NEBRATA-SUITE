import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-user-personnes-contacts',
  templateUrl: './info-user-personnes-contacts.component.html',
  styleUrls: ['./info-user-personnes-contacts.component.scss']
})
export class InfoUserPersonnesContactsComponent implements OnInit {

  @Input() personnesContacts: any;

  constructor() { }

  ngOnInit(): void {
  }

}
