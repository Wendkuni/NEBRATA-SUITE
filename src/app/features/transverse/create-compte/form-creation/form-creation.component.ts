import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { PieceOfficielle } from '@sycadApp/models/data-references/contribuables/global.model';
import { Document, Processus } from '@sycadApp/models/workflow/common/general';
import { CompteService } from '@sycadApp/services/data-references/contribuables/compte.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { mettreANullLesBlank, SycadUtils } from '@sycadApp/shared/utils.functions';
import { AffecationMinimumExist, GlobalPattern } from '@sycadApp/shared/validators/global-pattern';
import { AttributsExist } from '@sycadApp/shared/validators/remote/attributs-exist';
import { environment } from 'environments/environment';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CommonFormCreationCompte } from '../common-form-creation-compte';

@Component({
  selector: 'app-form-creation',
  templateUrl: './form-creation.component.html',
  styleUrls: ['./form-creation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormCreationComponent extends CommonFormCreationCompte  implements OnInit {

  public isLoadingResults = false;

   //  @ViewChild("recaptchaForm", { static: false })
    // public reCaptchaComponent: ReCaptchaComponent;

  public activeMediaQuery = '';
     ngAfterContentInit() {
      this.mediaObserver.media$.subscribe((change: MediaChange) => {
        this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      });
    }

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
    super(route,router,confirmService,fb,mediaObserver,_snackBar,compteService,reCaptchaV3Service);
    this.processus = this.route.snapshot.data["processus"];
    this.typeCompte = this.route.snapshot.paramMap.get("type");
    this.initFormulaire();
/*
    if(this.typeCompte==="AGENT" ) {
      this.formulaire = this.fb.group({
        email: [null, Validators.compose([Validators.required, Validators.email]),
        [AttributsExist.validateEmailExistPublicFn(this.compteService)]],
        telephone: [null, Validators.compose([ GlobalPattern.patternTelephoneBf]),
        [AttributsExist.validateTelephoneExistPublicFn(this.compteService)]],
        nationalite: [null],
        numeroIfu: [null],
        pieceOfficielle: this.formPieceOfficielle(null),
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
    }


    if(this.typeCompte==="CONTRIBUABLEPHYSIQUE" ) {
      this.formulaire = this.fb.group({
        email: [null, Validators.compose([Validators.required, Validators.email]),
        [AttributsExist.validateEmailExistPublicFn(this.compteService)]],
        telephone: [null, Validators.compose([ GlobalPattern.patternTelephoneBf]),
        [AttributsExist.validateTelephoneExistPublicFn(this.compteService)]],
        nationalite: [null],
        numeroIfu: [null],
        pieceOfficielle: this.formPieceOfficielle(null),
        prenoms: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
        nom: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
        nomDeJeuneFille: [null],
        genre: [null, Validators.compose([Validators.required])],
        typeCompte: ['CONTRIBUABLEPHYSIQUE', Validators.compose([Validators.required])],
        civilite: [null],
        dateNaissance: [null, Validators.compose([Validators.required])],
        lieuNaissance: [null],
        situationMatrimoniale: [null],
        profession: [null],
        nomPere: [null],
        prenomsPere: [null],
        structure: [null, Validators.compose([Validators.required])],
        nomMere: [null],
        prenomsMere: [null],
        document: this.createDocument(),
        parcelle: this.formParcelle(),
      });
    }

    if(this.typeCompte==="CONTRIBUABLEMORALE" ) {
      this.formulaire = this.fb.group({
        typeCompte: ['CONTRIBUABLEMORALE', Validators.compose([Validators.required])],
        dateDeCreation: [null],
        denomination: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
        sigle: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
        nationalite: [null],
        numeroIfu: [null],
        pieceOfficielle: this.formPieceOfficielle(null),
        activitePrincipale: [null],
        regimeFiscal: [null],
        structure: [null, Validators.compose([Validators.required])],
        numCNSS: [null],
        statusJuridique: [null, Validators.compose([Validators.required])],
        email: [null, Validators.compose([Validators.required, Validators.email]),
        [AttributsExist.validateEmailExistPublicFn(this.compteService)]],
        telephone: [null, Validators.compose([ GlobalPattern.patternTelephoneBf]),
        [AttributsExist.validateTelephoneExistPublicFn(this.compteService)]],
        document: this.createDocument(),
        parcelle: this.formParcelle(),
      });
    }

    if(this.typeCompte==="ACTEUR" ) {
      this.formulaire = this.fb.group({
        categorie: [null, Validators.compose([Validators.required])],
        typeCompte: ['ACTEUR', Validators.compose([Validators.required])],
        dateDeCreation: [null],
        numeroIfu: [null],
        denomination: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
        sigle: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
        nationalite: [null],
        pieceOfficielle: this.formPieceOfficielle(null),
        activitePrincipale: [null],
        regimeFiscal: [null],
        numCNSS: [null],
        statusJuridique: [null, Validators.compose([Validators.required])],
        email: [null, Validators.compose([Validators.required, Validators.email]),
        [AttributsExist.validateEmailExistPublicFn(this.compteService)]],
        telephone: [null, Validators.compose([ GlobalPattern.patternTelephoneBf]),
        [AttributsExist.validateTelephoneExistPublicFn(this.compteService)]],
      });


    }
*/


  }

  ngOnInit(): void {

  if(this.typeCompte!=="CONTRIBUABLEMORALE" && this.typeCompte!=="CONTRIBUABLEPHYSIQUE") {
    location.href="/";
  }
  }
  public onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    } else if(this.typeCompte==="CONTRIBUABLEPHYSIQUE" || this.typeCompte==="CONTRIBUABLEMORALE" ) {





      if (this.formulaire.value) {

        this.confirmService.confirm({
          title:"Confirmation",
          message:`Voulez-vous envoyer ces informations pour traitement ? `
        }).subscribe(($choix)=> {
          if($choix===true) {

            this.isLoadingResults =true;

            let { typeCompte,email,telephone,nationalite,pieceOfficielle,prenoms,nom,nomDeJeuneFille,
              genre,civilite,dateNaissance,lieuNaissance,situationMatrimoniale,profession,
              nomPere,prenomsPere,nomMere,prenomsMere,document,detientParcelle,parcelle,structure,
               matricule,fonction, denomination, sigle,dateDeCreation, numCNSS, numeroIfu,
               categorie, statusJuridique,regimeFiscal, activitePrincipale,affectation, adresses} = this.formulaire.value;


               let infoParcelle = null;
               if(detientParcelle) {
                let { commune, section, ilot, numero, numeroAncien}=parcelle;

                 infoParcelle = {
                 documentParcelle : document,
                 commune: commune,
                 section: section,
                 ilot: ilot,
                 numero: numero,
                 numeroAncien: numeroAncien
                };
               }



            let informationsContribuable = {email,prenoms,nom,nomDeJeuneFille,dateNaissance,lieuNaissance,
              nomPere,prenomsPere,nomMere,prenomsMere,matricule,fonction,denomination,dateDeCreation,sigle,numCNSS,
              telephone,numeroIfu,situationMatrimoniale,profession, genre, civilite, affectation, adresses,
              nationalite, pieceOfficielle, categorie, statusJuridique, regimeFiscal, activitePrincipale,infoParcelle};


            let dataPost = mettreANullLesBlank({typeCompte,structure, informationsContribuable});
            // this.reCaptchaComponent.reset();
            this.reCaptchaV3Service.execute('submitFormCreationCompteSycad')
           .subscribe((token) => {
        dataPost["recaptchaToken"]=token;

      // // console.log(dataPost);
        this.isLoadingResults =false;

        this.compteService.creerMonDossier(dataPost).subscribe(data => {
          this.isLoadingResults = false;
          this.openSnackBar("Demande de création de compte ajoutée avec succès","OK");
          this.router.navigate([`${environment.FRONTEND_ROUTES.SYSTEM_CREER_COMPTE}/info`,{email:informationsContribuable.email}]);
        },
        errorResponse => {
          this.isLoadingResults = false;
          SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
        }
      );

      },(error)=>{
        this.isLoadingResults =false;
        let mes= {
          message:"Impossible de valider ce formulaire"
        }
        SycadUtils.notifyRemoteError(mes, this._snackBar);
      });



          }
        });




      }
    }


  }

}
