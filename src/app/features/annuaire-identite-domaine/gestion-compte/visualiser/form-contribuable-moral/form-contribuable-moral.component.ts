import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CompteElement } from '@sycadApp/models/data-references/contribuables/compte.model';

@Component({
  selector: 'app-view-contribuable-moral',
  templateUrl: './form-contribuable-moral.component.html',
  styleUrls: ['./form-contribuable-moral.component.scss']
})
export class FormContribuableMoralComponent implements OnInit {
  @Input()
  compte: CompteElement;
  constructor() { }

  ngOnInit(): void {
   //// console.log(this.compte);

  }

}
