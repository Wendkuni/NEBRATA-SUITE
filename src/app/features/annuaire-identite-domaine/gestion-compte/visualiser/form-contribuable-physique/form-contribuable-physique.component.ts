import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CompteElement } from '@sycadApp/models/data-references/contribuables/compte.model';

@Component({
  selector: 'app-view-contribuable-physique',
  templateUrl: './form-contribuable-physique.component.html',
  styleUrls: ['./form-contribuable-physique.component.scss']
})
export class FormContribuablePhysiqueComponent implements OnInit {
  @Input()
  compte: CompteElement;

  constructor() { }

  ngOnInit(): void {
     //console.log(this.compte)

  }

}
