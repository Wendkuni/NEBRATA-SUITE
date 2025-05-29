import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Transition } from '@sycadApp/models/workflow/common/general';

@Component({
  selector: 'app-action-detail-dossier',
  templateUrl: './action-detail-dossier.component.html',
  styleUrls: ['./action-detail-dossier.component.scss']
})
export class ActionDetailDossierComponent implements OnInit {

  @Input() 
 public transitions: Transition[];

 @Input() 
 public url: String;

 @Input() 
 public numero: String;

  constructor(   private router: Router) { }

  ngOnInit(): void {

  }
  
  public actionProcessus(transitionCode: String) {
    this.router.navigate([this.url,this.numero, transitionCode]);
  }
}
