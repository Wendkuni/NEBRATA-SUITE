import { Component, OnInit,  Compiler, Injector} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DossierBornage } from '@sycadApp/models/bornage/bornage.model';
import { UserDossierInfo } from '@sycadApp/models/data-references/system/user-dossier.model';
import { UserProfilBornageService } from '@sycadApp/services/data-references/system/user-profil-bornage.service';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-info-user-bornages',
  templateUrl: './info-user-bornages.component.html',
  styleUrls: ['./info-user-bornages.component.scss']
})
export class InfoUserBornagesComponent  implements OnInit {
  public displayedColumns: string[]= ["numero","icad","etat","dateCreation","dateModification","objet","terminer","structure","action"];
  listDossier: UserDossierInfo[]=[];
  public dataSource: any;
  guid : string;
  constructor(public profilService: UserProfilBornageService, private injector: Injector,
    private compiler: Compiler, private router: Router, private route: ActivatedRoute) {
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
  ouvrirLeDossier(dossier: DossierBornage){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION}/view`, dossier.numero]);
  }
}
