import { Component, OnInit, Compiler, Injector} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDossierInfo } from '@sycadApp/models/data-references/system/user-dossier.model';
import { MandatElement } from '@sycadApp/models/workflow/common/general';
import { UserProfilMandatService } from '@sycadApp/services/data-references/system/user-profil-mandat.service';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-info-user-mandats',
  templateUrl: './info-user-mandats.component.html',
  styleUrls: ['./info-user-mandats.component.scss']
})
export class InfoUserMandatsComponent    implements OnInit {
  public displayedColumns: string[]= ["numero","dateCreation","dateModification","etat","objet","terminer","structure","action"];
  listDossier: UserDossierInfo[]=[];
  public dataSource: any;
  guid : string;

  constructor(public userProfilMandatService: UserProfilMandatService, private injector: Injector,
    private compiler: Compiler,private router: Router,  private route: ActivatedRoute) {
      this.guid=this.route.snapshot.params["guid"];
     }




    ngOnInit(): void {
      this.getAll();
    }
    getAll(){
      this.userProfilMandatService.getAll(this.guid).subscribe(data =>{
        this.listDossier = data;
        this.dataSource = new MatTableDataSource(this.listDossier);
      });
    }
  ouvrirLeDossier(dossier: MandatElement){
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_MANDAT}/view`, dossier.numero]);
  }
}


