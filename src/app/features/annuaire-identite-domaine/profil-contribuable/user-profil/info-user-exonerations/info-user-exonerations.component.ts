import { Compiler, Injector} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDossierInfo } from '@sycadApp/models/data-references/system/user-dossier.model';
import { ExonerationDossier } from '@sycadApp/models/impot/exoneration.model';
import { UserProfilExonerationService } from '@sycadApp/services/data-references/system/user-profil-exoneration.service';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-info-user-exonerations',
  templateUrl: './info-user-exonerations.component.html',
  styleUrls: ['./info-user-exonerations.component.scss']
})
export class InfoUserExonerationsComponent implements OnInit {


  public displayedColumns: string[]= ["numero","icad","etat","dateCreation","dateModification","objet","terminer","structure","action"];
  listDossier: UserDossierInfo[]=[];
  public dataSource: any;
  guid : string;

  constructor(public profilService: UserProfilExonerationService, private injector: Injector,
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

  ouvrirLeDossier(dossier: ExonerationDossier){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_EXONERATION}/view`, dossier.numero]);
  }
}
