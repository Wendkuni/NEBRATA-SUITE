import { Component, OnInit, Input } from '@angular/core';
import { EnteteDossierService } from '@sycadApp/services/workflow/entete.service';

import {Dossier, HistoriqueWorkflow, Processus} from '@sycadApp/models/workflow/common/general';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-entete',
  templateUrl: './entete.component.html',
  styleUrls: ['./entete.component.scss']
})
export class EnteteComponent implements OnInit {

  @Input()
  public numero:String;

  @Input()
  public processus:String;

 @Input()
 public dateCreationDossier: String;

  public entete: any;
  public enteteDataSource = new MatTableDataSource();
  displayedColumns: string[] = ['categorie', 'exemplaire', 'obligatoire'];
  constructor(public enteteDossierService: EnteteDossierService) { }


  ngOnInit(): void {
    if(this.numero){
      this.enteteDossierService.get(this.numero,this.processus).subscribe(data => {
        this.entete=data;
      });
    }else {
      this.enteteDossierService.getProcessus(this.processus).subscribe(data => {
        this.entete=data;
      });
    }
    this.enteteDataSource.data = this.entete;
  }

}
