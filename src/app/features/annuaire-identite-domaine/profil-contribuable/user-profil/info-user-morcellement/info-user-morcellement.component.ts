
import { Component, OnInit, Compiler, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDossierInfo } from '@sycadApp/models/data-references/system/user-dossier.model';
import { PlanCadastralMorcellementElement } from '@sycadApp/models/workflow/cp-morcellement.model';
import { UserProfilMorcellementService } from '@sycadApp/services/data-references/system/user-profil-morcellement.service';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-info-user-morcellement',
  templateUrl: './info-user-morcellement.component.html',
  styleUrls: ['./info-user-morcellement.component.scss']
})
export class InfoUserMorcellementComponent  implements OnInit {

  public displayedColumns: string[]= ["numero","icad","etat","dateCreation","dateModification","objet","terminer","structure","action"];
  listDossier: UserDossierInfo[]=[];
  public dataSource: any;
  guid : string;

  constructor(private injector: Injector,
    private compiler: Compiler,
    public profilService: UserProfilMorcellementService,private router: Router,  private route: ActivatedRoute) {
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

    ouvrirLeDossier(dossier: PlanCadastralMorcellementElement){
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MORCELLEMENT}/view`, dossier.numero]);
    }
  }


