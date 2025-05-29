import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-info-user-agent',
  templateUrl: './info-user-agent.component.html',
  styleUrls: ['./info-user-agent.component.scss'] /* ,
  encapsulation: ViewEncapsulation.None */
})
export class InfoUserAgentComponent implements OnInit {

  @Input() userData: any;

  constructor() { }

  ngOnInit(): void {
  }

}
