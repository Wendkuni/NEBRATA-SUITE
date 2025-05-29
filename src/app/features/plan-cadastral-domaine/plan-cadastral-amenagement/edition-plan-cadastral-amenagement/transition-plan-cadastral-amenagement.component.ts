
import { Input, Component, Directive } from '@angular/core';

import { TransitionPlanCadastralComponent } from '@sycadApp/shared/form-components/processus/transition.plan-cadastral.component';

import {PlanCadastralAmenagementElement} from '@sycadApp/models/workflow/cp-amenagement.model';
import { Validators, FormArray, FormBuilder } from '@angular/forms';
import { Processus, Transition } from '@sycadApp/models/workflow/common/general';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import { MediaObserver } from '@angular/flex-layout';
import { IlotElement } from '@sycadApp/models/data-references/territoire/localite.model';


@Directive()
export class TransitionPlanCadastralAmenagementComponent extends TransitionPlanCadastralComponent<PlanCadastralAmenagementElement> {
  @Input()
  public planCadastral: PlanCadastralAmenagementElement;
  @Input()
  public transition: Transition;

  @Input()
  public processus: Processus;

  public isLoadingResults = false;

    get ilots() { return this.formulaire.controls.ilots as FormArray; }
      /**************** sections  *************  ********/

      createIlot(ilot:IlotElement=null) {

        if(ilot==null) {
          return this.fb.group({
            id: [null],
            numeroAncien: [null],
            numero: [null, Validators.compose([Validators.required])],
            section: [null, Validators.compose([Validators.required])],
            parcelles:new FormArray([])
          });
        }else {

          let parcelles = [];
          if(ilot.parcelles) {
            parcelles = ilot.parcelles.map((parcelle) => {
              return  this.fb.group({
                id: [parcelle.id],
                numero: [parcelle.numero, Validators.compose([Validators.required])],
                numeroAncien: [parcelle.numeroAncien],
                libelle: [parcelle.libelle],    
                superficie: [parcelle.superficie, Validators.compose([Validators.required])],
                localite: [parcelle.localite, Validators.compose([Validators.required])],
              });
          });
          }

          let ilotForm= this.fb.group({
            id: [ilot.id],
            numeroAncien: [ilot.numeroAncien],
            numero: [ilot.numero, Validators.compose([Validators.required])],
            section: [ilot.section, Validators.compose([Validators.required])],
            parcelles:new FormArray(parcelles)
          });

          return ilotForm;
        }

      }
      addNewIlot() {
        this.ilots.insert(0, this.createIlot());

      }

      constructor(
        public router: Router,
        public _snackBar: MatSnackBar,
        public confirmService: AppConfirmService,
        public _adapter: DateAdapter<any>,
        public mediaObserver: MediaObserver,
        public fb: FormBuilder
        ){
         super(router,_snackBar,confirmService,_adapter,mediaObserver,fb);

         this.formulaire = this.fb.group({
          dossier : this.fb.group({
            objet: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
            dateExterne: [null, Validators.compose([Validators.required])],
            etatDossier: [null || false],
            refExterne: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
            observation: [null],
          }),
          dateMajPlan: [null, Validators.compose([Validators.required])],
          domaine: [null, Validators.compose([Validators.required])], //ETAT("ETAT"), PARTICULIER("PARTICULIER"), COLLECTIVITE("COLLECTIVITE");
         pieces: new FormArray([]),
        });
        }

      removeIlot(index) {

        this.ilots.removeAt(index);

      }
      /**************** fin sections *********************/
}
