import { Compiler, Component, Injector, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDossierInfo } from '@sycadApp/models/data-references/system/user-dossier.model';
import { DemandeDocument } from '@sycadApp/models/workflow/sd-demande-document.model';
import { UserProfilDemandeDocumentService } from '@sycadApp/services/data-references/system/user-profil-demande-document.service';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-info-user-demande-document',
  templateUrl: './info-user-demande-document.component.html',
  styleUrls: ['./info-user-demande-document.component.scss']
})
export class InfoUserDemandeDocumentComponent implements OnInit {
  public displayedColumns: string[]= ["numero","icad","etat","dateCreation","dateModification","objet","terminer","structure","action"];
  listDossier: UserDossierInfo[]=[];
  public dataSource: any;
  guid : string;

  constructor(public profilService: UserProfilDemandeDocumentService, private injector: Injector,
    private compiler: Compiler,private router: Router,  private route: ActivatedRoute) { 
      this.guid=this.route.snapshot.params["guid"];
    }

  ngOnInit(): void {
    this.getAll()
  }


  
  ouvrirLeDossier(dossier: DemandeDocument){
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_DEMANDE_DOCUMENT}/view`, dossier.numero]);
  }

  getAll(){
    this.profilService.getAll(this.guid).subscribe(data =>{
      this.listDossier = data;
      this.dataSource = new MatTableDataSource(this.listDossier);
    });

  }
}
