import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TransitionBornageDelimitationComponent } from '../transition-bornage-delimitation.component';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import {FormBuilder, Validators} from '@angular/forms';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {BornageDelimitationService} from '@sycadApp/services/bornage/bornage-delimitation.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {MatDialog} from '@angular/material/dialog';
import {CategoriePieceProcessus} from '@sycadApp/models/workflow/common/general';
import {environment} from '../../../../../../environments/environment';
import {SycadUtils} from '@sycadShared/utils.functions';
import {of} from 'rxjs';
import { GeneralContribuable } from '@sycadApp/models/data-references/contribuables/global.model';
import { ActeurElement } from '@sycadApp/models/data-references/contribuables/acteur.model';

@Component({
  selector: 'app-affectation-dbt',
  templateUrl: './affectation-dbt.component.html',
  styleUrls: ['./affectation-dbt.component.scss']
})
export class AffectationDBTComponent extends TransitionBornageDelimitationComponent  implements OnInit {


public acteurExterneChoisie:GeneralContribuable;

  constructor(public router: Router,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public categoriePieceService: CategoriePieceService,
    public bornageDelimitationService: BornageDelimitationService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public structureService: StructureService,
    public parcelleService: ParcelleService, public mandatService: MandatService) {
         super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService,bornageDelimitationService, acteurService, contribuableService, structureService,parcelleService,mandatService);
   
         this.formulaire =this.fb.group({
          numero: [null, [Validators.required]],
          action: [null, [Validators.required]]
        });
    

}

 
ngOnInit(): void {

  this.formulaire.patchValue({
    numero: this.bornage.numero,
    action: this.transition.code
  });

 
  if(this.bornage.acteurExterne) {
    this.acteurExterneChoisie=new GeneralContribuable();
    Object.assign(this.acteurExterneChoisie,this.bornage.acteurExterne);

  }else {

    this.formulaire.addControl('acteurExterne', this.fb.control(null, [Validators.required]));
    this.initConfigAutocompleteActeur();
  }
}
receiveSubjectActeur(acteur: any) {
   this.acteurExterneChoisie= acteur;
}

onSubmit() {
  if (!this.formulaire.valid) {
    return false;
  }
  


  let {acteurExterne,  action, numero } = this.formulaire.value;
  let dossier = (this.bornage.acteurExterne)? { action, numero}:{ acteurExterne, action, numero};

  this.loadingEvent.emit(true);
  this.bornageDelimitationService.executer(dossier).subscribe(data => {
    this.loadingEvent.emit(false);
      this.openSnackBar("Dossier de bornage modifié avec succès", "OK");
      this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION]);
    },
    errorResponse => {
      this.loadingEvent.emit(false);
      SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
    }
  );


}
resetForm() {
  this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION}`]);
}
}
