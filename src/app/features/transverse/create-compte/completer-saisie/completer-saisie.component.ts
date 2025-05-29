import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CompteElement } from '@sycadApp/models/data-references/contribuables/compte.model';
import { CompteService } from '@sycadApp/services/data-references/contribuables/compte.service';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { environment } from 'environments/environment';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CommonFormCreationCompte } from '../common-form-creation-compte';

@Component({
  selector: 'app-completer-saisie',
  templateUrl: './completer-saisie.component.html',
  styleUrls: ['./completer-saisie.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CompleterSaisieComponent extends CommonFormCreationCompte implements OnInit {


  public compteContribuable: CompteElement;
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
    this.compteContribuable = this.route.snapshot.data["compteContribuable"];
    this.typeCompte=this.compteContribuable.typeCompte;
    this.initFormulaire(false);



this.formulaire.addControl("numero",fb.control([null, [Validators.required]]));
this.formulaire.addControl("action",fb.control([null, [Validators.required]]));
  
if(this.typeCompte==="CONTRIBUABLEPHYSIQUE" || this.typeCompte==="CONTRIBUABLEMORALE") {
  this.formulaire.removeControl("structure");
}
this.formulaire.removeControl("typeCompte");

  }

  ngOnInit(): void {

  this.formulaire.patchValue({ 
    numero: this.compteContribuable.numero,
    action: "CREATION_COMPTE_RENVOIE_TO_VERIFICATION"
  });
  
    let informationsContribuable = this.compteContribuable.informationsContribuable;

    if(this.typeCompte==="AGENT" ) {
   

      this.formulaire.patchValue({
        email: informationsContribuable.email,
        telephone: informationsContribuable.telephone,
        nationalite: informationsContribuable.nationalite?.id,
        numeroIfu: informationsContribuable.numeroIfu,
        pieceOfficielle: informationsContribuable.pieceOfficielle || {},
        prenoms: informationsContribuable.prenoms,
        nom: informationsContribuable.nom,
        nomDeJeuneFille: informationsContribuable.nomDeJeuneFille,
        genre: informationsContribuable.genre,
        typeCompte: this.typeCompte,
        civilite: informationsContribuable.civilite?.id,
        dateNaissance: informationsContribuable.dateNaissance,
        lieuNaissance: informationsContribuable.lieuNaissance,
        situationMatrimoniale: informationsContribuable.situationMatrimoniale?.id,
        profession: informationsContribuable.profession?.id,
        nomPere: informationsContribuable.nomPere,
        prenomsPere: informationsContribuable.prenomsPere,
        nomMere: informationsContribuable.nomMere,
        prenomsMere: informationsContribuable.prenomsMere,
        matricule: informationsContribuable.matricule,
        fonction: informationsContribuable.fonction,
        affectation:{
          bureau: informationsContribuable.affectation?.bureau?.id,
          service: informationsContribuable.affectation?.service?.id,
          structure: informationsContribuable.affectation?.structure.id
        }
      
    });
    }


    if(this.typeCompte==="CONTRIBUABLEPHYSIQUE" ) {
      let infoParcelle = informationsContribuable.infoParcelle;

      this.formulaire.patchValue({
        email: informationsContribuable.email,
        telephone: informationsContribuable.telephone,
        nationalite: informationsContribuable.nationalite?.id,
        numeroIfu: informationsContribuable.numeroIfu,
       pieceOfficielle: informationsContribuable.pieceOfficielle || {},
        prenoms: informationsContribuable.prenoms,
        nom: informationsContribuable.nom,
        nomDeJeuneFille: informationsContribuable.nomDeJeuneFille,
        genre: informationsContribuable.genre,
        typeCompte: this.typeCompte,
        civilite: informationsContribuable.civilite?.id,
       dateNaissance: informationsContribuable.dateNaissance,
        structure: this.compteContribuable.transmission?.structure?.id,
        lieuNaissance: informationsContribuable.lieuNaissance,
        situationMatrimoniale: informationsContribuable.situationMatrimoniale?.id,
          profession: informationsContribuable.profession?.id,
        nomPere: informationsContribuable.nomPere,
        prenomsPere: informationsContribuable.prenomsPere,
        nomMere: informationsContribuable.nomMere,
        prenomsMere: informationsContribuable.prenomsMere, 
        document: {
        numero: infoParcelle.documentParcelle.numero,
        documentType: infoParcelle.documentParcelle.documentType.id,
        dateValidite: infoParcelle.documentParcelle.dateValidite,
        dateDoc:  infoParcelle.documentParcelle.dateDoc
       }
 
      });
    }

    if(this.typeCompte==="CONTRIBUABLEMORALE" ) {
      let infoParcelle = informationsContribuable.infoParcelle;

      this.formulaire.patchValue({
         typeCompte: this.typeCompte,
        dateDeCreation: informationsContribuable.dateDeCreation,
        denomination: informationsContribuable.denomination,
        sigle: informationsContribuable.sigle,
        nationalite: informationsContribuable.nationalite?.id,
        numeroIfu: informationsContribuable.numeroIfu,
        pieceOfficielle: informationsContribuable.pieceOfficielle || {},
        activitePrincipale: informationsContribuable.activitePrincipale?.id,
        regimeFiscal: informationsContribuable.regimeFiscal?.id,
        structure: this.compteContribuable.transmission?.structure?.id,
        numCNSS: informationsContribuable.numCNSS,
        statusJuridique: informationsContribuable.statusJuridique?.id,
        email: informationsContribuable.email,
        telephone: informationsContribuable.telephone,
        document: {
          numero: infoParcelle.documentParcelle.numero,
          documentType: infoParcelle.documentParcelle.documentType.id,
          dateValidite: infoParcelle.documentParcelle.dateValidite,
          dateDoc:  infoParcelle.documentParcelle.dateDoc
         }    
        });
    }

    if(this.typeCompte==="ACTEUR" ) {

      this.formulaire.patchValue({

        typeCompte: this.typeCompte,
        dateDeCreation: informationsContribuable.dateDeCreation,
        denomination: informationsContribuable.denomination,
        sigle: informationsContribuable.sigle,
        nationalite: informationsContribuable.nationalite?.id,
        numeroIfu: informationsContribuable.numeroIfu,
        pieceOfficielle: informationsContribuable.pieceOfficielle || {},
        activitePrincipale: informationsContribuable.activitePrincipale?.id,
        regimeFiscal: informationsContribuable.regimeFiscal?.id,
        structure: this.compteContribuable.transmission?.structure?.id,
        numCNSS: informationsContribuable.numCNSS,
        statusJuridique: informationsContribuable.statusJuridique?.id,
        email: informationsContribuable.email,
        telephone: informationsContribuable.telephone,
        categorie: informationsContribuable.categorie?.id,
      });
    }
  
    

  }

  public onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    } else {
      if (this.formulaire.value) {

        this.confirmService.confirm({
          title:"Confirmation",
          message:`Voulez-vous renvoyer ces informations pour traitement ? `
        }).subscribe(($choix)=> {
          if($choix===true) {
        
            this.isLoadingResults =true;
    
            let {numero,action, typeCompte,email,telephone,nationalite,pieceOfficielle,prenoms,nom,nomDeJeuneFille,
              genre,civilite,dateNaissance,lieuNaissance,situationMatrimoniale,profession,
              nomPere,prenomsPere,nomMere,prenomsMere,document,parcelle,structure,
               matricule,fonction, denomination, sigle,dateDeCreation, numCNSS, numeroIfu,
               categorie, statusJuridique,regimeFiscal, activitePrincipale,affectation} = this.formulaire.value;
          

               let infoParcelle = {};
          
               if(this.typeCompte!=="AGENT" && this.typeCompte!=="ACTEUR" ) { 
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
              telephone,numeroIfu,situationMatrimoniale,profession, genre, civilite, affectation, 
              nationalite, pieceOfficielle, categorie, statusJuridique, regimeFiscal, activitePrincipale,infoParcelle};
    
            
            let dataPost = {numero,action,typeCompte,structure, informationsContribuable};
            this.reCaptchaV3Service.execute('submitFormCreationCompteSycad')
           .subscribe((token) => {
        dataPost["recaptchaToken"]=token;
    
      // // console.log(dataPost);
        this.isLoadingResults =false;

        this.compteService.updateMonDossier(dataPost).subscribe(data => {
          this.isLoadingResults = false;
          this.openSnackBar("Demande de création de compte mise à jour avec succès","OK");
          location.href =environment.FRONTEND_ROUTES.SITE_EXTERNE;
        },
        errorResponse => {
          this.isLoadingResults = false;
          SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
        }
      );  

      },(error)=>{
        this.isLoadingResults =false;
        let mes= {
          message:"Impossible de compléter ce formulaire"
        }
        SycadUtils.notifyRemoteError(mes, this._snackBar);
      });
          
  
            
          }       
        }); 

     

  
      }
    } 

    
  }


}
