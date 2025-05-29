import {
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from "@angular/forms";
import { Subject, of} from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RemoteAutocomplete } from "@sycadApp/shared/form-components/model/remote-autocomplete";
import { RemoteAutocompleteIndivisionMemebrable } from "@sycadApp/shared/form-components/model/remote-autocomplete-guid";
import { DateAdapter } from "@angular/material/core";
import {Civilite, StatusJuridique, ReseauSociaux, Contact} from '@sycadApp/models/data-references/system/model';

import { Nationalite, PieceOfficielle,AdresseContribuable, PersonneAContacter, CategoriePiece} from '@sycadApp/models/data-references/contribuables/global.model';
import { StatusJuridiqueService } from '@sycadApp/services/data-references/system/status-juridique.service';
import {CiviliteService} from '@sycadApp/services/data-references/system/civilite-service.service';
import {GlobalPattern, AdresseMinimumExist,AffecationMinimumExist, MustMatch, getErrors} from '@sycadShared/validators/global-pattern';
import { NationaliteService } from '@sycadApp/services/data-references/system/nationalite.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';

import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';

import {AgentElement} from "@sycadApp/models/data-references/contribuables/agent.model";
import {
  NationaliteAutocomplete,
  ProfessionAutocomplete, SituationMatrimonialeAutocomplete, TitreHonorifiqueAutocomplete
} from '@sycadApp/models/data-references/contribuables/global.model';
import {LocaliteAutocomplete, ParcelleElement} from "@sycadApp/models/data-references/territoire/localite.model";

import {StructureAutocomplete} from "@sycadApp/models/data-references/organigramme/structure.model";
import {ServiceAutocomplete} from "@sycadApp/models/data-references/organigramme/service.model";
import {ProfilAutocomplete} from "@sycadApp/models/data-references/security/profil.model";
import {RoleAutocomplete} from "@sycadApp/models/data-references/security/role.model";
import { TitreHonorifiqueService } from '@sycadApp/services/data-references/system/titreHonorifique.service';
import {AgentsService} from '@sycadApp/services/data-references/contribuables/agent.service';
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';

import { SituationMatrimonialeService } from '@sycadApp/services/data-references/system/situationMatrimoniale.service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { ProfilesService } from '@sycadApp/services/data-references/security/profiles.service';
import { RolesService } from '@sycadApp/services/data-references/security/roles-services';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { AttributsExist } from '@sycadApp/shared/validators/remote/attributs-exist';
import { takeUntil } from 'rxjs/operators';
import { BureauAutocomplete } from '@sycadApp/models/data-references/organigramme/bureau.model';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { PieceOfficielleService } from '@sycadApp/services/data-references/system/piece-officielle.service';
import { RechercheContribuableIFU } from "@sycadApp/shared/form-components/data-references-domaine/recherche-ifu/recherche-ifu.component";
import {
  MatSlideToggleChange
} from "@angular/material/slide-toggle";
import { RechercheContribuableONI } from "@sycadApp/shared/form-components/data-references-domaine/recherche-oni/recherche-oni.component";


@Component({
  selector: 'app-form-page-agent',
  templateUrl: './form-page-agent.component.html',
  styleUrls: ['./form-page-agent.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormPageAgentComponent implements OnInit {
  public formulaire: FormGroup;
  public  agent: AgentElement;

  public isLoadingResults = false;

  public formulaireAgent: FormGroup;
  public passwordHide: boolean = true;
  public selectTypeContact = 'EMAIL';
  public isOther:boolean = false;
  public maxDateNaissance;
  public minDateNaissance;
  private _onDestroy = new Subject<void>();
  public civilityRemoteAutocomplete = new RemoteAutocomplete<Civilite>();
  public nationaliteRemoteAutocomplete = new RemoteAutocomplete<Nationalite>();
  public titreHonorifiqueRemoteAutocomplete = new RemoteAutocomplete<TitreHonorifiqueAutocomplete>();
  public localiteRemoteAutocomplete = new RemoteAutocomplete<LocaliteAutocomplete>();
  public nationnaliteRemoteAutocomplete = new RemoteAutocomplete<NationaliteAutocomplete>();
  public professionRemoteAutocomplete = new RemoteAutocomplete<ProfessionAutocomplete>();
  public situationMatrimonialeRemoteAutocomplete = new RemoteAutocomplete<SituationMatrimonialeAutocomplete>();
  public bureauRemoteAutocomplete = new RemoteAutocomplete<BureauAutocomplete>();
  public structureRemoteAutocomplete = new RemoteAutocomplete<StructureAutocomplete>();
  public serviceRemoteAutocomplete = new RemoteAutocomplete<ServiceAutocomplete>();
  public categorieIdentiteRemoteAutocomplete = new RemoteAutocomplete<CategoriePiece>();
  public profileRemoteAutocomplete = new RemoteAutocomplete<ProfilAutocomplete>();
  public roleRemoteAutocomplete = new RemoteAutocomplete<RoleAutocomplete>();
  public contribuableRemoteAutocomplete = new RemoteAutocompleteIndivisionMemebrable();
  public statusJuridiqueAutocomplete = new RemoteAutocomplete<StatusJuridique>();
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
    //  this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
     //// console.log("this.activeMediaQuery",this.activeMediaQuery)
      //this.grid.cols = this.gridByBreakpoint[change.mqAlias];
    });
  }

  get prenoms() { return this.formulaire.get('prenoms'); }
  get nom() { return this.formulaire.get('nom'); }
  get nomDeJeuneFille() { return this.formulaire.get('nomDeJeuneFille'); }
  get situationMatrimoniale() { return this.formulaire.get('situationMatrimoniale'); }
  get profession() { return this.formulaire.get('profession'); }
  get nationalite() { return this.formulaire.get('nationalite');}

  get genre() { return this.formulaire.get('genre'); }
  get civilite() { return this.formulaire.get('civilite'); }
  get lieuNaissance() { return this.formulaire.get('lieuNaissance'); }
  get dateNaissance() { return this.formulaire.get('dateNaissance'); }

  get prenomsPere() { return this.formulaireAgent.get('prenomsPere'); }
  get nomPere() { return this.formulaireAgent.get('nomPere'); }
  get prenomsMere() { return this.formulaireAgent.get('prenomsMere'); }
  get nomMere() { return this.formulaireAgent.get('nomMere'); }

  get active() { return this.formulaire.get('active'); }
  get username() { return this.formulaire.get('username'); }
  get guid() { return this.formulaire.get('guid'); }
  get password() { return this.formulaire.get('password'); }
  get passwordc() { return this.formulaire.get('passwordc'); }
  get profils() { return this.formulaire.get('profils'); }
  get roles() { return this.formulaire.get('roles'); }

  get matricule() { return this.formulaire.get('matricule'); }
  get fonction() { return this.formulaire.get('fonction'); }
  get titreHonorifique() { return this.formulaire.get('titreHonorifique'); }

  get service() { return this.formulaire.get('affectation').get('service'); }
  get bureau() { return this.formulaire.get('affectation').get('bureau'); }
  get structure() { return this.formulaire.get('affectation').get('structure'); }
  get pieceOfficielle() { return this.formulaire.get("pieceOfficielle") ;}
  get adresses() { return this.formulaire.controls.adresses as FormArray ;}
  get telephones() { return this.formulaire.get("telephones") as FormArray;}
  get emails() { return this.formulaire.get("emails") as FormArray;}
  get reseauSociaux() {return this.formulaire.controls.reseauSociaux as FormArray;}
  get personnesContacts() {return this.formulaire.controls.personnesContacts as FormArray;}

  get getFormPieceComplementaire() { return this.formulaire.controls.pieceComplementaires as FormArray; }



  constructor(
    public fb: FormBuilder,
    public civiliteService : CiviliteService,
    public titreHonorifiqueService : TitreHonorifiqueService,
    public agentService : AgentsService,
    private router: Router,
    public confirmService:AppConfirmService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public pieceOfficielleService: PieceOfficielleService,
    public statusJuridiqueService: StatusJuridiqueService,
    private mediaObserver: MediaObserver,
    public contactContribuableService: ContactContribuableService,
    private _adapter: DateAdapter<any>,
    public bureauService : BureauService,
    public localiteService : LocaliteService,
    public parcelleService : ParcelleService,
    public nationaliteService:NationaliteService,
    public situationMatrimonialeService:SituationMatrimonialeService,
    public professionService:ProfessionService,
    public serviceAdminService : ServiceAdministratifService,
    public typePieceIdentiteService : CategoriePieceService,
    public structureService : StructureService,
    public profilsService: ProfilesService,
    public rolesService: RolesService
  ) {

    this.agent=this.route.snapshot.data["agent"];


    this.formulaire = this.fb.group({
      guid:[null],
      active: [false],
      resetOtp: [false],
      username: [null,
        null,
        [AttributsExist.validateUsernameExistFn(this.contactContribuableService)]],
      password: [null, Validators.compose([])],
      passwordc: [null, Validators.compose([])],
      emails: new FormArray([]),
      telephones: new FormArray([]),
      adresses: new FormArray([]),
      reseauSociaux: new FormArray([]),
      nationalite: [null],
      pieceComplementaires: new FormArray([]),
      pieceOfficielle:this.fb.group({
        categorie: [null, [Validators.required,Validators.maxLength(150),Validators.minLength(2)]],
        dateExpiration: [null],
        dateObtention: [null, Validators.compose([Validators.required])],
        numero: [null,
          Validators.compose([Validators.required,Validators.maxLength(150),Validators.minLength(2)]),
          [AttributsExist.validateNumeroPieceExistFn(this.contactContribuableService,true)]],
        nip: [null],
        autoriteDeDelivrance: [null],
        lieuDeDelivrance: [null],
        codeDownload: null,
      }),
      prenoms: [null, [Validators.required,Validators.maxLength(150),Validators.minLength(2)]],
      nom: [null, [Validators.required,Validators.maxLength(150),Validators.minLength(2)]],
      nomDeJeuneFille: [null],
      genre: [null, Validators.compose([Validators.required])],
      civilite: [null],
      dateNaissance: [null, Validators.compose([Validators.required])],
      lieuNaissance: [null],
      profession: [null],
      situationMatrimoniale: [null],
      nomPere: [null],
      prenomsPere: [null],
      nomMere: [null],
      prenomsMere: [null],
      matricule: [null, [Validators.required,Validators.maxLength(150),Validators.minLength(2)]],
      fonction: [null],
      affectation:this.fb.group({
        bureau: [null],
        service:[null],
        structure: [null],
        signataire: [false],
        interim: [false]}, {
          validator: AffecationMinimumExist()
        }),
      titreHonorifique: [null],
      profils: [null],
      roles: [null],
      personnesContacts: new FormArray([]),
    },
    {
      validator: MustMatch('password', 'passwordc')
    });

  }


  public formErrors: Array<string>;


  ngOnInit(): void {

    this.formulaire.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.formErrors = getErrors(this.formulaire);
    });

   this._adapter.setLocale("fr");



  /* this.structure.valueChanges.subscribe(structure => {
    if(structure) {
      this.service.reset();
      this.bureau.reset();
      this.serviceRemoteAutocomplete.params.set("structure",structure.code);
      this.bureauRemoteAutocomplete.params.set("structure",structure.code);
    }
  });  */

   /*
   this.bureau.valueChanges.subscribe(x => {
    if(x) {
      this.service.reset();
      this.structure.reset();
    }

  });

  this.service.valueChanges.subscribe(x => {
    if(x) {
      this.bureau.reset();
      this.structure.reset();
    }
  });



  */



    let currentDate = new Date();
    this.maxDateNaissance = new Date(currentDate.getFullYear() - 10, currentDate.getMonth(), currentDate.getDay());
    this.minDateNaissance = new Date(currentDate.getFullYear() - 70, currentDate.getMonth(), currentDate.getDay());

    this.civilityRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.civiliteService);
    this.bureauRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.bureauService);
    this.localiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.localiteService);
    this.titreHonorifiqueRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.titreHonorifiqueService);
    this.serviceRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.serviceAdminService);
    this.nationnaliteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.nationaliteService);
    this.professionRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.professionService);
    this.situationMatrimonialeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.situationMatrimonialeService);
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.structureService);
    this.categorieIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.typePieceIdentiteService);
    this.profileRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.profilsService);
    this.roleRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.rolesService);
    this.nationaliteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.nationaliteService);
    this.statusJuridiqueAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.statusJuridiqueService);
    this.profileRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.profilsService);
    this.roleRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.rolesService);

    this.profileRemoteAutocomplete.params.set("type","AGENT");
    this.roleRemoteAutocomplete.params.set("type","ADMINISTRATION");

    if (this.agent) {

    // // console.log("this.agent",this.agent);

      if(this.agent.affectation?.bureau) {
        this.bureauRemoteAutocomplete.listRessource$=of([this.agent.affectation.bureau]);
        this.bureauRemoteAutocomplete.initialList=[this.agent.affectation.bureau];
      }
      if(this.agent.affectation?.structure) {
        this.structureRemoteAutocomplete.listRessource$=of([this.agent.affectation.structure]);
        this.structureRemoteAutocomplete.initialList=[this.agent.affectation.structure];
        this.serviceRemoteAutocomplete.params.set("structure",this.agent.affectation.structure.code);
        this.bureauRemoteAutocomplete.params.set("structure",this.agent.affectation.structure.code);
      }
      if(this.agent.affectation?.service) {
        this.serviceRemoteAutocomplete.listRessource$=of([this.agent.affectation.service]);
        this.serviceRemoteAutocomplete.initialList=[this.agent.affectation.service];
        this.bureauRemoteAutocomplete.params.set("service",this.agent.affectation.service.code);
      }
      if(this.agent?.civilite) {
        this.civilityRemoteAutocomplete.listRessource$=of([this.agent.civilite]);
        this.civilityRemoteAutocomplete.initialList=[this.agent.civilite];
      }
      if(this.agent?.nationalite) {
        this.nationnaliteRemoteAutocomplete.listRessource$=of([this.agent.nationalite]);
        this.nationnaliteRemoteAutocomplete.initialList=[this.agent.nationalite];
      }
      if(this.agent?.profession) {
        this.professionRemoteAutocomplete.listRessource$=of([this.agent.profession]);
        this.professionRemoteAutocomplete.initialList=[this.agent.profession];
      }
      if(this.agent?.situationMatrimoniale) {
        this.situationMatrimonialeRemoteAutocomplete.listRessource$=of([this.agent.situationMatrimoniale]);
        this.situationMatrimonialeRemoteAutocomplete.initialList=[this.agent.situationMatrimoniale];
      }
      if(this.agent.pieceOfficielle && this.agent.pieceOfficielle.categorie){
        this.categorieIdentiteRemoteAutocomplete.listRessource$= of([this.agent.pieceOfficielle.categorie]);
        this.categorieIdentiteRemoteAutocomplete.initialList= [this.agent.pieceOfficielle.categorie];
      }

      if(this.agent?.profils) {
        this.profileRemoteAutocomplete.listRessource$=of(this.agent.profils);
        this.profileRemoteAutocomplete.initialList=this.agent.profils;
      }
      if(this.agent?.roles) {
        this.roleRemoteAutocomplete.listRessource$=of(this.agent.roles);
        this.roleRemoteAutocomplete.initialList=this.agent.roles;
      }
      if (this.agent.pieceComplementaires) {
        this.agent.pieceComplementaires.map((piece) => {
          this.getFormPieceComplementaire.insert(0, this.createPieceOfficielle(piece));
      });
      }
      if (this.agent.telephones) {
        this.agent.telephones.map((telephone) => {
          this.telephones.insert(0, this.createTelephone(telephone));
      });
      }

      if (this.agent.emails) {
        this.agent.emails.map((mail) => {
          this.emails.insert(0, this.createEmail(mail));
      });
      }
      if (this.agent.adresses) {
        this.agent.adresses.map((adresse) => {
          this.adresses.insert(0, this.createAdresse(adresse));
      });
      }

      if (this.agent.reseauSociaux) {
        this.agent.reseauSociaux.map((reseau) => {
          this.reseauSociaux.insert(0, this.createReseauSocial(reseau));
      });
      }

      if (this.agent.personnesContacts) {
        this.agent.personnesContacts.map((personneContact) => {
          this.personnesContacts.insert(0, this.createPersonnesContacts(personneContact));
      });
      }

      this.formulaire.patchValue({
        pieceOfficielle: {
          codeDownload: this.agent.pieceOfficielle?.documentPiece,
        }
       });
      this.formulaire.patchValue({
        guid: this.agent.guid,
        active: this.agent.active,
        username: this.agent.username,
        nationalite:this.agent.nationalite?.id,
        civilite:this.agent.civilite?.id,
        situationMatrimoniale:this.agent.situationMatrimoniale?.id,
        pieceOfficielle: this.agent.pieceOfficielle || {},
        prenoms: this.agent.prenoms,
        nom: this.agent.nom,
        nomDeJeuneFille: this.agent.nomDeJeuneFille,
        profession:this.agent.profession?.id,
        genre: this.agent.genre,
        lieuNaissance: this.agent.lieuNaissance,
        dateNaissance:this.agent.dateNaissance,
        prenomsPere: this.agent.prenomsPere,
        nomPere: this.agent.nomPere,
        nomMere: this.agent.nomMere,
        prenomsMere:this.agent.prenomsMere,
        matricule:this.agent.matricule,
        fonction: this.agent.fonction,
        titreHonorifique:this.agent.titreHonorifique?.id,

        profils:this.agent.profils.map(profil => profil.id),
        roles: this.agent.roles.map(role => role.id),
        affectation:{
          bureau: this.agent.affectation?.bureau?.id,
          service: this.agent.affectation?.service?.id,
          structure: this.agent.affectation?.structure?.id,
          signataire: this.agent.affectation?.signataire,
          interim: this.agent.affectation?.interim
        }
      });
    } else {
      this.agent = new AgentElement();
    }
  }


  public onCiviliteChange(event: any): void {
    this.checkFields();
  }
  public checkFields(): void {
    const situation = this.formulaire.get('situationMatrimoniale')?.value;
    const nomDeJeuneFilleControl = this.formulaire.get('nomDeJeuneFille');
    if (situation === 1 || situation === 6) {
      nomDeJeuneFilleControl?.enable();
    } else {
      nomDeJeuneFilleControl?.setValue('');
      nomDeJeuneFilleControl?.disable();
    }

  }




  public onChangeSignataire(event: MatSlideToggleChange) {
    if (!event.checked) {
      this.formulaire.patchValue({
        affectation: {
          interim: false,
        }
      });
    }
  }

  public onChangeInterim(event: MatSlideToggleChange) {
    if (event.checked) {
      this.formulaire.patchValue({
        affectation: {
          signataire: true,
        }
      });
    }
  }



  public onSearchContribuable(eventNgSelect) {
    this.contribuableRemoteAutocomplete.term.next(eventNgSelect.term);
  }


  public onChangeStructure(structure:StructureAutocomplete) {

    this.serviceRemoteAutocomplete.resetParams();
    this.serviceRemoteAutocomplete.initialList=[];
    this.service.reset();

    this.bureauRemoteAutocomplete.resetParams();
    this.bureauRemoteAutocomplete.initialList=[];
    this.bureau.reset();
   //// console.log("structure",structure)
    if(structure){
      this.serviceRemoteAutocomplete.params.set("structure",structure.code);
      this.serviceRemoteAutocomplete.term.next("");


      this.bureauRemoteAutocomplete.params.set("structure",structure.code);
      this.bureauRemoteAutocomplete.term.next("");

    }


  }
  public onChangeService(service:ServiceAutocomplete) {

    this.bureauRemoteAutocomplete.resetParams();
    this.bureauRemoteAutocomplete.initialList=[];
    this.bureau.reset();

    if(service) {
      this.bureauRemoteAutocomplete.params.set("service",service.code);
      this.bureauRemoteAutocomplete.term.next("");
    }

  }



  resetForm(){


    if(this.agent.guid) {
      this.router.navigate([`${environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT}`]);
    }else {
      this.formulaire.reset();
    }
  }

  trouveContribuable(rechercheContribuableIFU: RechercheContribuableIFU){
    if(!rechercheContribuableIFU.success){
      SycadUtils.notifyRemoteError( {message: rechercheContribuableIFU.message}, this._snackBar);
    }else {
      this.openSnackBar("Un résultat a été trouvé","OK");
    }
  }

  trouveContribuableONI(rechercheContribuableONI: RechercheContribuableONI){
    if(!rechercheContribuableONI.success){
      SycadUtils.notifyRemoteError( {message: rechercheContribuableONI.message}, this._snackBar);
    }else {
      this.openSnackBar("Un résultat a été trouvé","OK");
    }
  }

  onSubmit() {




    if (!this.formulaire.valid) {
      return false;
    } else {
      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.guid) {

          this.agentService.update(this.formulaire.value).subscribe(data => {
            this.isLoadingResults=false;
            this.openSnackBar("Contribuable agent modifiée avec succès","OK");
            this.router.navigate([environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT]);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );

        } else {
          this.agentService.add(this.formulaire.value).subscribe(data => {
            this.isLoadingResults=false;
            this.openSnackBar("Contribuable agent ajoutée avec succès","OK");
            this.router.navigate([environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT]);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        }
      }
    }


    }


  public onSearchStatusJuridique(eventNgSelect){
    this.statusJuridiqueAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchCivilite(eventNgSelect) {
    this.civilityRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchNationalite(eventNgSelect) {
    this.nationaliteRemoteAutocomplete.term.next(eventNgSelect.term);
  }




  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }

  public getUrlRedirect() {
    return environment.FRONTEND_ROUTES.CONTRIBUABLE_AGENT+"/edition";
  }
  /**************** piece officielle *********************/

  createPieceOfficielle(piece:PieceOfficielle) {
    if(piece) {
      return this.fb.group({
        id: [piece.id],
        categorie: [piece.categorie, Validators.compose([Validators.required])],
        dateExpiration: [piece.dateExpiration],
        dateObtention: [piece.dateObtention, Validators.compose([Validators.required])],
        numero: [piece.numero,
          Validators.compose([Validators.required, Validators.maxLength(150), Validators.minLength(2)]),
        [AttributsExist.validateNumeroPieceExistFn(this.contactContribuableService)]],
        nip: [piece.nip],
        autoriteDeDelivrance: [piece.autoriteDeDelivrance],
        lieuDeDelivrance: [piece.lieuDeDelivrance],
        codeDownload: [piece.documentPiece],
      });
    }else {
      return this.fb.group({
        id: [null],
        categorie: [null, Validators.compose([Validators.required])],
        dateExpiration: [null],
        dateObtention: [null, Validators.compose([Validators.required])],
        numero: [null,
          Validators.compose([Validators.required, Validators.maxLength(150), Validators.minLength(2)]),
        [AttributsExist.validateNumeroPieceExistFn(this.contactContribuableService)]],
        nip: [null],
        autoriteDeDelivrance: [null],
        lieuDeDelivrance: [null],
        codeDownload: null,
      });
    }
  }
  addNewPieceIdentiteInfo() {
    this.getFormPieceComplementaire.insert(0, this.createPieceOfficielle(null));

   }

   removePieceIdentite(index) {
    let pieceOfficielle = this.getFormPieceComplementaire.at(index);
    if (pieceOfficielle.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer cette pièce complémentaire ? `
      }).subscribe(($choix)=> {

        if($choix) {
          this.isLoadingResults=true;
          this.pieceOfficielleService.delete(this.agent.guid,pieceOfficielle.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.getFormPieceComplementaire.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }

      });
    } else {
      this.getFormPieceComplementaire.removeAt(index);
    }
  }
  /**************** fin piece officielle *********************/

  /**************** téléphone *********************/

  removeTelephones(index) {
    let telephone = this.telephones.at(index);
    if (telephone.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer ce  téléphone ? `
      }).subscribe(($choix)=> {

        if($choix) {
          this.isLoadingResults=true;
          this.contactContribuableService.deleteTelephone(this.agent.guid,telephone.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.telephones.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }

      });
    } else {
      this.telephones.removeAt(index);
    }
  }
  createTelephone(telephone:Contact) {
    if(telephone) {
      return this.fb.group({
        id: [telephone.id],
        principal: [telephone.principal],
        level: [telephone.level, Validators.compose([Validators.required])],
        numero: [telephone.value, Validators.compose([Validators.required, GlobalPattern.patternTelephoneBf])]
      });
    }else {
      return this.fb.group({
        id: [null],
        principal: [false],
        level: ["PROFESSIONAL", Validators.compose([Validators.required])],
        numero: [null, Validators.compose([Validators.required, GlobalPattern.patternTelephoneBf])]
      });
    }
  }
  addNewTelephone() {
    this.telephones.insert(0, this.createTelephone(null));
  }
public onChangeTelephonePrincipal(telephone) {
  this.telephones.controls.forEach(telCtl => {
    if(telCtl!==telephone) {
      telCtl.patchValue({
        principal: false
      });
    }
  });
}
  /**************** fin téléphone *********************/



  /**************** email *********************/
  createEmail(mail:Contact) {
    if(mail) {
      return this.fb.group({
        id: [mail.id],
        principal: [mail.principal],
        level: [mail.level, Validators.compose([Validators.required])],
        email: [mail.value, Validators.compose([Validators.required, Validators.email]),
        [AttributsExist.validateEmailExistFn(this.contactContribuableService)]]
      });
    }else {
      return this.fb.group({
        id: [null],
        principal: [false],
        level: ["PROFESSIONAL", Validators.compose([Validators.required])],
        email: [null, Validators.compose([Validators.required, Validators.email]),
        [AttributsExist.validateEmailExistFn(this.contactContribuableService)]]
      });
    }
  }

  addNewEmail() {
    this.emails.insert(0, this.createEmail(null));
  }


  removeEmails(index) {
    let email = this.emails.at(index);
    if (email.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer cette adresse Email ? `
      }).subscribe(($choix)=> {

        if($choix) {
          this.isLoadingResults=true;
          this.contactContribuableService.deleteEmail(this.agent.guid,email.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.emails.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }

      });
    } else {
      this.emails.removeAt(index);
    }
  }

  public onChangeEmailPrincipal(email) {
    this.emails.controls.forEach(mailCtl => {
      if(mailCtl!==email) {
        mailCtl.patchValue({
          principal: false
        });
      }

    });
  }

  /**************** fin email *********************/


  /**************** adresse *********************/
  createAdresse(adresse:AdresseContribuable) {
    if(adresse) {
      return this.fb.group({
        id: [adresse.id],
        libelle: [adresse.libelle],
        principal: [adresse.principal],
        localite: [adresse.localite],
        rue: [adresse.rue],
        porte: [adresse.porte],
        quartier: [adresse.quartier],
        ville: [adresse.ville, Validators.compose([Validators.required])],
        pays: [adresse.pays, Validators.compose([Validators.required])]
      },{
        validator: AdresseMinimumExist()
      });
    }else {
      return this.fb.group({
        id: [null],
        libelle: [null],
        principal: [false],
        localite: [null],
        rue: [null],
        porte: [null],
        quartier: [null],
        ville: [null, Validators.compose([Validators.required])],
        pays: [null, Validators.compose([Validators.required])]
      },{
        validator: AdresseMinimumExist()
      });
    }
  }
  addNewAdresse(){
    this.adresses.insert(0, this.createAdresse(null));

  }
  removeAdresse(index) {
    let adresse = this.adresses.at(index);
    if (adresse.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer cette adresse Email ? `
      }).subscribe(($choix)=> {
        if($choix) {
          this.isLoadingResults=true;
          this.contactContribuableService.deleteAdresse(this.agent.guid,adresse.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.adresses.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }

      });
    } else {
      this.adresses.removeAt(index);
    }
  }
  public onChangeAdressePrincipal(adresse) {
    this.adresses.controls.forEach(adresseCtl => {
      if(adresseCtl!==adresse) {
        adresseCtl.patchValue({
          principal: false
        });
      }

    });
  }

  /**************** fin adresse *********************/


  /**************** reseau sociaux *********************/
  createReseauSocial(resaux:ReseauSociaux) {
    if(resaux) {
      return this.fb.group({
        id: [resaux.id],
        profil: [resaux.profil],
        type: [resaux.type]
      });
    }else {
      return this.fb.group({
        id: [null],
        profil: [null],
        type: [null]
      });
    }
  }
  addNewReseauSocial(){
    this.reseauSociaux.insert(0, this.createReseauSocial(null));
  }
  removeReseauSocial(index) {
    let reseauSociau = this.reseauSociaux.at(index);
    if (reseauSociau.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer ce réseau social ? `
      }).subscribe(($choix)=> {

        if($choix) {
          this.isLoadingResults=true;
          this.contactContribuableService.deleteReseauSocial(this.agent.guid,reseauSociau.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.reseauSociaux.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }
      });
    } else {
      this.reseauSociaux.removeAt(index);
    }
  }
  /**************** fin reseau sociaux *********************/


  /**************** personne contact *********************/
  //
  createPersonnesContacts(personneContact:PersonneAContacter) {
    if(personneContact) {
      return this.fb.group({
        id: [personneContact.id],
        prenom: [personneContact.prenom,Validators.compose([Validators.required])],
        nom: [personneContact.nom, Validators.compose([Validators.required])],
        profession: [personneContact.profession],
        telephone: [personneContact.telephone, Validators.compose([Validators.required,GlobalPattern.patternTelephoneBf])],
        email: [personneContact.email, Validators.compose([Validators.required,Validators.email])],
        civilite: [personneContact.civilite],
        adresse: this.createAdresse(personneContact.adresse),
        genre: [personneContact.genre, Validators.compose([Validators.required])],

      });
    }else {


      return this.fb.group({
        id: [null],
        prenom: [null,Validators.compose([Validators.required])],
        nom: [null, Validators.compose([Validators.required])],
        telephone: [null, Validators.compose([Validators.required,GlobalPattern.patternTelephoneBf])],
        email: [null, Validators.compose([Validators.required,Validators.email])],
        civilite: [null],
        profession: [null],
        adresse: this.createAdresse(null),
        genre: [null, Validators.compose([Validators.required])],

      });
    }
  }
  addNewPersonnesContactsInfo(){
    this.personnesContacts.insert(0, this.createPersonnesContacts(null));
  }
  removePersonnesContact(index) {
    let personneContact = this.personnesContacts.at(index);
    if (personneContact.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer cette personne contact ? `
      }).subscribe(($choix)=> {

        if($choix) {
          this.isLoadingResults=true;
          this.contactContribuableService.deletePersonneAContacter(this.agent.guid,personneContact.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.personnesContacts.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }
      });
    } else {
      this.personnesContacts.removeAt(index);
    }
  }
  /**************** fin personne contact *********************/
  public onSearchCategoriePiece(eventNgSelect) {
    this.categorieIdentiteRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchTitreHonorifique(eventNgSelect) {
    this.titreHonorifiqueRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchBureau(eventNgSelect) {
    this.bureauRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchService(eventNgSelect) {
    this.serviceRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchNationnalite(eventNgSelect) {
    this.nationnaliteRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchSituationMatrimonial(eventNgSelect) {
    this.situationMatrimonialeRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchProfession(eventNgSelect) {
    this.professionRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchStructure(eventNgSelect) {
    this.structureRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchProfile(eventNgSelect){
    this.profileRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchRole(eventNgSelect){
    this.roleRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchLocalite(eventNgSelect) {
    this.localiteRemoteAutocomplete.term.next(eventNgSelect.term);
  }
}
