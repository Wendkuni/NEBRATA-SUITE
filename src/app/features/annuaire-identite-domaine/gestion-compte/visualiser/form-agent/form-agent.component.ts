import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CompteElement } from '@sycadApp/models/data-references/contribuables/compte.model';

@Component({
  selector: 'app-view-agent',
  templateUrl: './form-agent.component.html',
  styleUrls: ['./form-agent.component.scss']
})
export class FormAgentComponent implements OnInit {
@Input()
compte: CompteElement;


constructor() { }

  ngOnInit(): void {
   //// console.log(this.compte);

  }

}
