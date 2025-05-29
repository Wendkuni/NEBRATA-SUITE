import { Component, OnInit,Compiler, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDossierInfo } from '@sycadApp/models/data-references/system/user-dossier.model';

import { DossierContributionFonciere } from '@sycadApp/models/impot/contribution-fonciere.model';
import { UserProfilContributionFService } from '@sycadApp/services/data-references/system/user-profil-contribution.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-info-user-contribution-fonciere',
  templateUrl: './info-user-contribution-fonciere.component.html',
  styleUrls: ['./info-user-contribution-fonciere.component.scss']
})
export class InfoUserContributionFonciereComponent implements OnInit {
  public displayedColumns: string[]= ["numero","icad","etat","dateCreation","dateModification","objet","terminer","structure","action"];
  listDossier: UserDossierInfo[]=[];
  public dataSource: any;
  guid : string;
  constructor(public profilService: UserProfilContributionFService, private injector: Injector,
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
  ouvrirLeDossier(dossier: DossierContributionFonciere){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_CONTRIBUTION_FONCIERE}/view`, dossier.numero]);
  }
}
