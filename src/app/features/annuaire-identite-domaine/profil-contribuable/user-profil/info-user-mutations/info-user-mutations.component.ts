
import { Component, OnInit, Compiler, Injector } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDossierInfo } from '@sycadApp/models/data-references/system/user-dossier.model';
import { ParcelleItem } from '@sycadApp/models/data-references/territoire/localite.model';
import { AttributionParcelle } from '@sycadApp/models/workflow/sd-attribution.model';

import { MutationParcelle } from '@sycadApp/models/workflow/sd-mutation.model';
import { UserProfilMutationService } from '@sycadApp/services/data-references/system/user-profil-mutation.service';
import { CycledeVieParcelleComponent } from '@sycadApp/shared/form-components/plan-cadastral/cycle-de-vie-parcelle/app-cycledevie-parcelle.component';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-info-user-mutations',
  templateUrl: './info-user-mutations.component.html',
  styleUrls: ['./info-user-mutations.component.scss']
})
export class InfoUserMutationsComponent implements OnInit {

  public displayedColumns: string[]= ["numero","icad","etat","dateCreation","dateModification","objet","terminer","structure","action"];
  listDossier: UserDossierInfo[]=[];
  public dataSource: any;
  guid : string;

  constructor(public profilService: UserProfilMutationService, private injector: Injector,
    public dialog: MatDialog, private mediaObserver: MediaObserver,
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
  ouvrirLeDossier(dossier: MutationParcelle){
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION}/view`, dossier.numero]);
  }


  public dialogRef: MatDialogRef<CycledeVieParcelleComponent,any>;

  ouvrirModalCycleDeVie(dossier: MutationParcelle) {
    console.log(dossier)
    let parcelle = new ParcelleItem();
    parcelle.icad=dossier["icad"];
    let { width,height,position}=this.getCorrectWidth();
    this.dialogRef = this.dialog.open(CycledeVieParcelleComponent, {
     data: parcelle,
     panelClass:"sycad-dialog-form",
     width: width,
     height: height,
     position: position,
     disableClose:true
  })
}

private getCorrectWidth() {

  if(this.mediaObserver.isActive("xs")) {
    return {
      width: '90vw',
      height: '60vh',
      position: {
        top:'2vh',
      }
    };
  }

  if(this.mediaObserver.isActive("sm")) {
    return {
      width: '70vw',
      height: '60vh',
      position: {
        top:'2vh',
      }
    };
  }

  if(this.mediaObserver.isActive("md")) {
    return {
      width: '70vw',
      height: '80vh',
      position: {
        top:'2vh',
      }
    };
  }

  if(this.mediaObserver.isActive("lg")) {
    return {
      width: '70vw',
      height: '80vh',
      position: {
        top:'2vh',
      }
    };
  }
  if(this.mediaObserver.isActive("xl")) {
    return {
      width: '70vw',
      height: '80vh',
      position: {
        top:'2vh',
      }
    };
  }
}
}
