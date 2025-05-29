import { Component, OnInit, Compiler, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {  ActivatedRoute, Router } from '@angular/router';
import { UserDossierInfo } from '@sycadApp/models/data-references/system/user-dossier.model';
import { PlanCadastralFusionementElement } from '@sycadApp/models/workflow/cp-fusionnement.model';
import { UserProfilLotissementService } from '@sycadApp/services/data-references/system/user-profil-lotissement.service';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-info-user-lotissement',
  templateUrl: './info-user-lotissement.component.html',
  styleUrls: ['./info-user-lotissement.component.scss']
})
export class InfoUserLotissementComponent  implements OnInit {


  public displayedColumns: string[]= ["numero","dateCreation","dateModification","etat","objet","terminer","structure","action"];
  listDossier: UserDossierInfo[]=[];
  public dataSource: any;
  guid : string;
  constructor(public profilService: UserProfilLotissementService, private injector: Injector,
    private compiler: Compiler,private router: Router,  private route: ActivatedRoute) {
      this.guid=this.route.snapshot.params["guid"];
     }




    ngOnInit(): void {
      this.getAll();
    }
    getAll(){
      this.profilService.getAll(this.guid).subscribe(data =>{
        this.listDossier = data;
        this.dataSource = new MatTableDataSource(this.listDossier);
      });
    }
  ouvrirLeDossier(dossier: PlanCadastralFusionementElement){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_LOTISSEMENT}/view`, dossier.numero]);
  }
}
