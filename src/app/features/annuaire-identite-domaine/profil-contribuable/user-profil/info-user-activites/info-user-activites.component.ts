import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-user-activites',
  templateUrl: './info-user-activites.component.html',
  styleUrls: ['./info-user-activites.component.scss']
})
export class InfoUserActivitesComponent implements OnInit {

  @Input() activitePrincipale: any = null;
  @Input() activitesSecondaires: any;

  constructor() { }

  ngOnInit(): void {
  }

}
