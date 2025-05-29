
import { Component, OnInit, Compiler, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDossierInfo } from '@sycadApp/models/data-references/system/user-dossier.model';
import { PlanCadastralAmenagementElement } from '@sycadApp/models/workflow/cp-amenagement.model';
import { UserProfilAmenagementService } from '@sycadApp/services/data-references/system/user-profil-amenagement.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-info-user-amenagement',
  templateUrl: './info-user-amenagement.component.html',
  styleUrls: ['./info-user-amenagement.component.scss']
})
export class InfoUserAmenagementComponent  implements OnInit {

  public displayedColumns: string[]= ["numero","etat","dateCreation","dateModification","objet","terminer","structure","action"];
  listDossier: UserDossierInfo[]=[];
  public dataSource: any;
  guid : string;
  constructor(public profilService: UserProfilAmenagementService, private injector: Injector,
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
  ouvrirLeDossier(dossier: PlanCadastralAmenagementElement){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_AMENAGEMENT}/view`, dossier.numero]);
  }
}
