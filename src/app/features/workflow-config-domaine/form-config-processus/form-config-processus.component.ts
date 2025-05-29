import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-form-config-processus',
  templateUrl: './form-config-processus.component.html',
  styleUrls: ['./form-config-processus.component.scss']
})
export class FormConfigProcessusComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
public getFormTemplate(){
    return environment.FRONTEND_ROUTES.CONFIGURATION_WORKFLOW;
}
}
