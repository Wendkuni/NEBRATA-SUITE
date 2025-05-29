import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CompteElement } from '@sycadApp/models/data-references/contribuables/compte.model';

@Component({
  selector: 'app-view-acteur',
  templateUrl: './form-acteur.component.html',
  styleUrls: ['./form-acteur.component.scss']
})
export class FormActeurComponent implements OnInit {
  
@Input()  
compte: CompteElement;


  constructor() { }

  ngOnInit(): void {

  }

}
