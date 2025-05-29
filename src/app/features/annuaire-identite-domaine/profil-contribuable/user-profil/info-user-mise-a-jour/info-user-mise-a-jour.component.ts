
import { Component, OnInit, Input, Compiler, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDossierInfo } from '@sycadApp/models/data-references/system/user-dossier.model';
import { PlanCadastralMAJLotissementElement } from '@sycadApp/models/workflow/maj-lotissement.model';
import { UserProfilMiseAJourService } from '@sycadApp/services/data-references/system/user-profil-mise-a-jour.service';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-info-user-mise-a-jour',
  templateUrl: './info-user-mise-a-jour.component.html',
  styleUrls: ['./info-user-mise-a-jour.component.scss']
})
export class InfoUserMiseAJourComponent implements OnInit {

  public displayedColumns: string[]= ["numero","dateCreation","dateModification","etat","objet","terminer","structure","action"];
  listDossier: UserDossierInfo[]=[];
  public dataSource: any;
  guid : string;

  constructor(public profilService: UserProfilMiseAJourService, private injector: Injector,
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
  ouvrirLeDossier(dossier: PlanCadastralMAJLotissementElement){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE}/view`, dossier.numero]);
  }
}
