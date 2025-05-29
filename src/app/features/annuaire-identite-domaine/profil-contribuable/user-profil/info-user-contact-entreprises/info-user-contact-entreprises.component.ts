import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-user-contact-entreprises',
  templateUrl: './info-user-contact-entreprises.component.html',
  styleUrls: ['./info-user-contact-entreprises.component.scss']
})
export class InfoUserContactEntreprisesComponent implements OnInit {

  @Input() contactEntreprises: any[];

  constructor() { }

  ngOnInit(): void {
  }

}
