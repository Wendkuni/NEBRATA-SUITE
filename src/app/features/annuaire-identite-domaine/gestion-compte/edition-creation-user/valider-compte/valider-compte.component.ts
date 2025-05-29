import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TransitionCreationUserComponent} from '@sycadFeature/annuaire-identite-domaine/gestion-compte/edition-creation-user/transition-creation-user.component';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {MediaObserver} from '@angular/flex-layout';
import {FormBuilder} from '@angular/forms';
import {CompteService} from '@sycadApp/services/data-references/contribuables/compte.service';
import {ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';
import {GeneralContribuable} from '@sycadApp/models/data-references/contribuables/global.model';
import {of} from 'rxjs';
import {SycadUtils} from '@sycadShared/utils.functions';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-valider-compte',
  templateUrl: './valider-compte.component.html',
  styleUrls: ['./valider-compte.component.scss']
})
export class ValiderCompteComponent extends  TransitionCreationUserComponent implements OnInit {
  get dossier() { return this.formulaire.get("dossier") ;}

  @Output("change")
  public change:  EventEmitter<ParcelleElement> = new EventEmitter<ParcelleElement>();
  public contribuableMatcheChoisie: GeneralContribuable;
  constructor(public router: Router,
              public dialog: MatDialog,
              public _snackBar: MatSnackBar,
              public confirmService: AppConfirmService,
              public _adapter: DateAdapter<any>,
              public mediaObserver: MediaObserver,
              public fb: FormBuilder,
              public compteService: CompteService) {
    super(router, dialog,_snackBar, confirmService,_adapter, mediaObserver, fb, compteService);
  }

  ngOnInit(): void {
    if (this.compteContribuable) {
      this.contribuableMatcheChoisie=this.compteContribuable.contribuableMatche;
      this.initFormulaire();
    }

  }
  onSubmit() {

    this.confirmService.confirm({
      title:"Confirmation",
      message:`Voulez-vous envoyer ces informations pour traitement ? `
    }).subscribe(($choix)=> {
      if($choix===true) {
        this.loadingEvent.emit(true);
        let {observation} = this.formulaire.value.dossier;
        let {action, numero,} = this.formulaire.value;

        let dataPost = {action, numero, observation};

        this.compteService.executer(dataPost).subscribe(data => {
            //this.isLoadingResults = false;
            this.loadingEvent.emit(false);
            this.openSnackBar("Demande de création de compte modifiée avec succès","OK");
            this.router.navigate([environment.FRONTEND_ROUTES.GESTION_COMPTE]);
          },
          errorResponse => {
            this.loadingEvent.emit(false);
            SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
          }
        );
      }
    });

  }

}
