import { Component, Input, OnInit } from "@angular/core";
import { MediaObserver } from "@angular/flex-layout";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { CompteElement } from "@sycadApp/models/data-references/contribuables/compte.model";
import { Ilot, PieceOfficielle, Section } from "@sycadApp/models/data-references/contribuables/global.model";
import { CommuneItem } from "@sycadApp/models/data-references/territoire/commune.model";
import { ParcelleElement } from "@sycadApp/models/data-references/territoire/localite.model";
import { Document, Processus } from "@sycadApp/models/workflow/common/general";
import { CompteService } from "@sycadApp/services/data-references/contribuables/compte.service";
import { AppConfirmService } from "@sycadApp/shared/app-confirm/app-confirm.service";
import { AffecationMinimumExist, GlobalPattern } from "@sycadApp/shared/validators/global-pattern";
import { AttributsExist } from "@sycadApp/shared/validators/remote/attributs-exist";
import { ReCaptchaV3Service } from "ng-recaptcha";


export class CommonFormCreationCompte {
    public processus: Processus;
    public typeCompte;
    public formulaire: FormGroup;
    public compteContribuable: CompteElement;

       public isLoadingResults = false;



    constructor(
        public route: ActivatedRoute,
        public router: Router,
        public confirmService:AppConfirmService,
        public fb: FormBuilder,
        public mediaObserver: MediaObserver,
        public _snackBar: MatSnackBar,
        public compteService: CompteService,
        public reCaptchaV3Service : ReCaptchaV3Service
      ) {

      }

       initFormulaire(isNewDossier:Boolean=true){

     /*   if(this.typeCompte==="AGENT" ) {
          this.formulaire = this.fb.group({
            email: [null, Validators.compose([Validators.required, Validators.email]),
            [AttributsExist.validateEmailExistPublicFn(this.compteService)]],
            telephone: [null, Validators.compose([ GlobalPattern.patternTelephoneBf]),
            [AttributsExist.validateTelephoneExistPublicFn(this.compteService)]],
            nationalite: [null],
            numeroIfu: [null],
            pieceOfficielle: this.formPieceOfficielle(isNewDossier),
            prenoms: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
            nom: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
            nomDeJeuneFille: [null],
            genre: [null, Validators.compose([Validators.required])],
            typeCompte: ['AGENT', Validators.compose([Validators.required])],
            civilite: [null],
            dateNaissance: [null, Validators.compose([Validators.required])],
            lieuNaissance: [null],
            situationMatrimoniale: [null],
            profession: [null],
            nomPere: [null],
            prenomsPere: [null],
            nomMere: [null],
            prenomsMere: [null],


            matricule: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
            fonction: [null],
            affectation:this.fb.group({
              bureau: [null],
              service:[null],
              structure: [null]}, {
              validator: AffecationMinimumExist()
            }),
          });
        }  */


        if(this.typeCompte==="CONTRIBUABLEPHYSIQUE" ) {
          this.formulaire = this.fb.group({
            email: [null, Validators.compose([Validators.required, Validators.email])],
            telephone: [null, Validators.compose([ GlobalPattern.patternTelephoneBf, Validators.compose([Validators.required])])],
            nationalite: [null],
            detientParcelle: [false, Validators.compose([Validators.required])],
            numeroIfu: [null],
            pieceOfficielle: this.formPieceOfficielle(isNewDossier),
            prenoms: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
            nom: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
            nomDeJeuneFille: [null],
            genre: [null, Validators.compose([Validators.required])],
            typeCompte: ['CONTRIBUABLEPHYSIQUE', Validators.compose([Validators.required])],
            civilite: [null],
            dateNaissance: [null, Validators.compose([Validators.required])],
            lieuNaissance: [null, Validators.compose([Validators.required])],
            situationMatrimoniale: [null, Validators.compose([Validators.required])],
            adresses: new FormArray([]),
            profession: [null],
            nomPere: [null],
            prenomsPere: [null],
           // structure: [null, Validators.compose([Validators.required])],
            nomMere: [null],
            prenomsMere: [null],
           // document: this.createDocument(isNewDossier),
            //parcelle: this.formParcelle(),
          });
        }

        if(this.typeCompte==="CONTRIBUABLEMORALE" ) {
          this.formulaire = this.fb.group({
            typeCompte: ['CONTRIBUABLEMORALE', Validators.compose([Validators.required])],
            sigle: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
            detientParcelle: [false, Validators.compose([Validators.required])],
            numeroIfu: [null, Validators.compose([Validators.required])],
          //  pieceOfficielle: this.formPieceOfficielle(isNewDossier),
            adresses: new FormArray([]),
            email: [null, Validators.compose([Validators.required, Validators.email])],
            telephone: [null, Validators.compose([ GlobalPattern.patternTelephoneBf, Validators.compose([Validators.required])])],
           // document: this.createDocument(isNewDossier),
           // parcelle: this.formParcelle(),
          });
        }

      /*  if(this.typeCompte==="ACTEUR" ) {
          this.formulaire = this.fb.group({
            categorie: [null, Validators.compose([Validators.required])],
            typeCompte: ['ACTEUR', Validators.compose([Validators.required])],
            dateDeCreation: [null],
            numeroIfu: [null],
            denomination: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
            sigle: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
            nationalite: [null],
            pieceOfficielle: this.formPieceOfficielle(isNewDossier),
            activitePrincipale: [null],
            regimeFiscal: [null],
            capitalFiscal: [null],
            chiffreAffaire: [null],
            numCNSS: [null],
            statusJuridique: [null, Validators.compose([Validators.required])],
            email: [null, Validators.compose([Validators.required, Validators.email]),
            [AttributsExist.validateEmailExistPublicFn(this.compteService)]],
            telephone: [null, Validators.compose([ GlobalPattern.patternTelephoneBf]),
            [AttributsExist.validateTelephoneExistPublicFn(this.compteService)]],
          });


        } */
       }


    formParcelle(){
      return  this.fb.group({
        commune: [null, Validators.compose([Validators.required])],
        section: [null, Validators.compose([Validators.required])],
        ilot: [null, Validators.compose([Validators.required])],
        numero: [null, Validators.compose([Validators.required,GlobalPattern.numeroParcelle] ),],
        numeroAncien: [null]
      });

       }

      createDocument(isNewDossier:Boolean=true) {

        if(isNewDossier){
          return this.fb.group({
            numero: [null, [Validators.required]],
            pieceJointe: [null, [Validators.required]],
         //   dateValidite: [null],
            documentType: [null, [Validators.required]],
            dateDoc: [null, [Validators.required]]
          });
        }else {
          return this.fb.group({
            numero: [null, [Validators.required]],
            pieceJointe: [null],
       //     dateValidite: [null],
            documentType: [null, [Validators.required]],
            dateDoc: [null, [Validators.required]]
          });
        }


      }

      formPieceOfficielle(isNewDossier:Boolean=true){
        if(isNewDossier){
          return  this.fb.group({
            categorie: [null, Validators.compose([Validators.required])],
            dateExpiration: [null],
            dateObtention: [null, Validators.compose([Validators.required])],
            numero: [null,
              Validators.compose([Validators.required, Validators.maxLength(150), Validators.minLength(2)]),
            ],
            nip: [null],
            autoriteDeDelivrance: [null],
            lieuDeDelivrance: [null],
            codeDownload: [null, [Validators.required]]
          });
        }else{
          return  this.fb.group({
            categorie: [null, Validators.compose([Validators.required])],
            dateExpiration: [null],
            dateObtention: [null, Validators.compose([Validators.required])],
            numero: [null,
              Validators.compose([Validators.required, Validators.maxLength(150), Validators.minLength(2)]),
            ],
            nip: [null],
            autoriteDeDelivrance: [null],
            lieuDeDelivrance: [null],
            codeDownload: [null]
          });
        }

      }


      public  resetForm(){
        this.router.navigate(['/']);
      }

      public  openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
          duration: 25000,
          verticalPosition: "top",
        });
      }

      public onCaptchaResponse($event) {
          //// console.log("response ",$event)
         }

         public onCaptchaExpired() {
          // console.log("onCaptchaExpired ")
         }
}
