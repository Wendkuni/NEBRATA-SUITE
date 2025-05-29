
import { Component, OnInit, Compiler, Injector } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDossierInfo } from '@sycadApp/models/data-references/system/user-dossier.model';
import { ParcelleItem } from '@sycadApp/models/data-references/territoire/localite.model';
import { RetraitParcelle } from '@sycadApp/models/workflow/sd-retrait.model';
import { UserProfilRetraitService } from '@sycadApp/services/data-references/system/user-profil-retrait.service';
import { CycledeVieParcelleComponent } from '@sycadApp/shared/form-components/plan-cadastral/cycle-de-vie-parcelle/app-cycledevie-parcelle.component';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-info-user-retrait',
  templateUrl: './info-user-retrait.component.html',
  styleUrls: ['./info-user-retrait.component.scss']
})
export class InfoUserRetraitComponent implements OnInit {

  public displayedColumns: string[]= ["numero","icad","dateCreation","dateModification","etat","objet","terminer","structure","action"];
  listDossier: UserDossierInfo[]=[];
  public dataSource: any;
  guid : string;

  constructor(public profilService: UserProfilRetraitService, private injector: Injector,
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

  ouvrirLeDossier(dossier: RetraitParcelle){
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_RETRAIT}/view`, dossier.numero]);
  }

  public dialogRef: MatDialogRef<CycledeVieParcelleComponent,any>;

  ouvrirModalCycleDeVie(dossier: RetraitParcelle) {
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
