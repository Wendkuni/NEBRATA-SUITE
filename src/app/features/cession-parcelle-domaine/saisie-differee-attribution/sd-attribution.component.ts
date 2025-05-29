import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {Subject, catchError, map, of} from 'rxjs';
import {AbstractSycadTableComponent} from '@sycadApp/libs/sycad-table/sycad-table-abstract.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {Router} from '@angular/router';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MatDialog} from '@angular/material/dialog';
import {
  ActionProcessusEvent,
  GenericActionEvent,
  SycadTableColonne,
  SycadTableMetaData,
  TypeColonne
} from '@sycadApp/libs/model-table';
import {StatsExport} from '@sycadShared/directives/export.service';
import { SdAttributionService } from '@sycadApp/services/workflow/sd-attribution.service';
import { AttributionParcelle } from '@sycadApp/models/workflow/sd-attribution.model';
import { environment } from 'environments/environment';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import { IlotService } from '@sycadApp/services/cession-parcelle/ilot.service';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { Ilot, Section } from '@sycadApp/models/data-references/contribuables/global.model';
import { IlotElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { AdvancedRemoteAutocomplete } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { ActeursService } from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { SaisieDiffereeAttributionContexteService } from '@sycadApp/services/workflow/saisie-differee-attribution-contexte.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { SdEntetePVService } from '@sycadApp/services/workflow/sd-entetePV.service';
import { EntetePVAutocomplete } from '@sycadApp/models/workflow/sd-entete-pv.model';


@Component({
  selector: 'app-plan-cadastral-sd-attribution',
  templateUrl: './sd-attribution.component.html',
  styleUrls: ['./sd-attribution.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SdAttributionComponent extends AbstractSycadTableComponent  implements OnInit,OnChanges {
  [x: string]: any;


  commune:CommuneAutocomplete = new CommuneAutocomplete();
  public numeroDePage: number | null = null;
  public sectionChoisieId:number;
  public ilotChoisieId:number;
  public sectionChoisie:string;
  public ilotChoisie:string;
  public entetepv: EntetePVAutocomplete;
  private _onDestroy = new Subject<void>();
  SdAttributionService: any;

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }



  @ViewChild("datatable1", { read: ViewContainerRef })
  private anchor: ViewContainerRef;

  public refeshDataSubject: Subject<string> = new Subject<string>();
  public  getAnchor(): ViewContainerRef {
    return this.anchor;
  }
  public entetePVRemoteAutocomplete = new AdvancedRemoteAutocomplete<EntetePVAutocomplete>();
  public section:number;
  public ilot:number;
  public numeropv:string;
  public communeId:number;
  public communeRemoteAutocomplete;
  public sectionRemoteAutocomplete = new RemoteAutocomplete<Section>();
  public ilotRemoteAutocomplete = new RemoteAutocomplete<IlotElement>();
  public  formulaire: FormGroup;
  constructor( private _snackBar: MatSnackBar,
               private mediaObserver: MediaObserver,
               private router: Router,
               public confirmService: AppConfirmService,
               public dialog: MatDialog,private compiler: Compiler,
               private injector: Injector, public attributionparcelle: SdAttributionService,
               public communeService: CommunesService,
               public saisieDiffereeAttributionContexteService:SaisieDiffereeAttributionContexteService,
               public sectionService: SectionService,
               public entetePVService:SdEntetePVService,
               public acteurService: ActeursService,
               private formBuilder: FormBuilder,
               public ilotService: IlotService)
  {
    super();
    this.formulaire = this.formBuilder.group({
      entetepv: this.formBuilder.control(null),
      section: this.formBuilder.control(null),
      ilot: this.formBuilder.control(null),
      numeroPage: this.formBuilder.control(null),
      numeropv: this.formBuilder.control(null),
      commune: this.formBuilder.control(null),
        });
  }


  initForm() {
    this.formulaire = this.formBuilder.group({
      entetepv: this.formBuilder.control(null),
      section: this.formBuilder.control(null),
      ilot: this.formBuilder.control(null),
      numeroPage: this.formBuilder.control(null),
      numeropv: this.formBuilder.control(null),
      commune: this.formBuilder.control(null),
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  initConfigAutocompleteEntetePV() {

    let callbackAutocomplete = (search:string,params:Map<string,any>)=> {
      return this.entetePVService.autocompletion(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };
    this.entetePVRemoteAutocomplete.customNgSelectConfig = {
      multiple: false,
      controlName: 'entetepv',
      libelle: 'libelle',
      term: new Subject<string>(),
      callbackAutocomplete: callbackAutocomplete,
      formulaire: this.formulaire,
      placeholder: "Les entêtes des pv"
    };

    this.entetePVRemoteAutocomplete.nativeNgSelectConfig.placeholder = "L'entête pv";
    this.entetePVRemoteAutocomplete.nativeNgSelectConfig.appendTo = 'body';
    this.entetePVRemoteAutocomplete.nativeNgSelectConfig.bindValue = 'numero';
    this.entetePVRemoteAutocomplete.listItemSelected = [];
    this.entetePVRemoteAutocomplete.keyId = 'numero';
    this.entetePVRemoteAutocomplete.callbackAutocomplete=callbackAutocomplete;

    this.entetePVRemoteAutocomplete.mapFunction = (entetepv: EntetePVAutocomplete): EntetePVAutocomplete => {
      entetepv.libelle = "commune: "+entetepv.arrondissement.commune.nom+" - Arrondissement: "+entetepv.arrondissement.nom+" - "+entetepv.cessionSource.libelle+" - "+entetepv.documentDeSortie?.numero+" - "+entetepv.documentDeSortie?.libelle;

      return entetepv;
    };
    const colTabAttributaire = [
      { name: 'cessionSource.libelle', label: 'Cession source' },
      { name: 'documentDeSortie.numero', label: 'Numéro' },
      { name: 'documentDeSortie.libelle', label: 'Libelle'},
    ];

    this.entetePVRemoteAutocomplete.tableDescription = this.entetePVRemoteAutocomplete.pushColumn(colTabAttributaire, 'Tableau des PV');

  }
  receiveSubjectActeur(event: any) {
    if (event) {
      const acteurControl = this.formulaire.get('entetepv');
      if (acteurControl) {
        this.entetepv = event;
        this.sectionRemoteAutocomplete.init=false;
        this.onChangeCommune(this.entetepv.arrondissement.commune);


      } else {
        console.error('entête existe pas');
      }
    }
  }

  rechercher() {
    if (this.formulaire.valid) {
      const queryParams: { [key: string]: string | number } = {};

      if (this.formulaire.get('numeropv')?.value) {
        queryParams['numeroDePV_fulltext'] = this.formulaire.get('numeropv').value;
      }
      console.log(this.sectionChoisie);
      if (this.sectionChoisie) {
        queryParams['parcelle.ilot.section.numero_fulltext'] = this.sectionChoisie;      }
      console.log(this.ilotChoisie);
      if (this.ilotChoisie) {
        queryParams['parcelle.ilot.numero_fulltext'] = this.ilotChoisie;
      }

      console.log(this.numeroDePage);
      if (this.numeroDePage) {
        queryParams['dossier_attributaire_numeroDePage'] = this.numeroDePage;
      }
      queryParams['page'] = '0';
      queryParams['limit'] = '10';
      this.isLoadingResults = true;
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION}`], {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      }).then(() => {
        location.reload();
      });
    }
  }
  effacer() {
    this.formulaire.reset();
    this.saisieDiffereeAttributionContexteService.supprimer()
    .subscribe(
      data => {
        this.isLoadingResults = false;
        this.sectionRemoteAutocomplete = new RemoteAutocomplete<Section>();
        this.ilotRemoteAutocomplete = new RemoteAutocomplete<IlotElement>();
        SycadUtils.notifyRemoteInfo("Contexte vidé avec succès", this._snackBar);
      },
      errorResponse => {
        this.isLoadingResults = false;
       SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
        }
    );
  }

  sauvegarder() {
    if (this.formulaire.valid) {
      this.isLoadingResults = true;
      this.saisieDiffereeAttributionContexteService.add(this.formulaire.value)
        .subscribe(
          data => {
            this.isLoadingResults = false;
            SycadUtils.notifyRemoteInfo("Contexte initialisé avec succès", this._snackBar);
          },
          errorResponse => {
            this.isLoadingResults = false;
            SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
          }
        );

    }
  }


  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {



      this.monTableau=new SycadTableMetaData("Tableau des dossiers d'attributon",true,false);
      this.monTableau
      .pushColumn(new SycadTableColonne("numero","Numero dossier",true,TypeColonne.STRING,true,""))
        .pushColumn(new SycadTableColonne("documentDeSortie.numero","Numéro du PV",true,TypeColonne.STRING,true,""))
        .pushColumn(new SycadTableColonne("documentDeSortie.dateDoc","Date attribution",true,TypeColonne.DATE,true,""))
        .pushColumn(new SycadTableColonne("documentDeSortie.libelle","Document attribution",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("attributaire.codeUnique","IFU-Code",true,TypeColonne.STRING,true,"",true,"attributaire_nom"))
      .pushColumn(new SycadTableColonne("parcelle.icad","Parcelle",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("etat","Processus",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("statusDossier","Statut dossier",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("transmission.transmission","Localisation dossier",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("attributionEtat","Etat d'attribution",true,TypeColonne.STRING,true,""))
      .pushColumn(new SycadTableColonne("dateCreationDossier","Date de création",true,TypeColonne.DATETIME,true,""))
      .pushColumn(new SycadTableColonne("dateModificationDossier","Date de modification",true,TypeColonne.DATETIME,true,""))

    .pushColumn(new SycadTableColonne("etatDossier","Etat Processus",true,TypeColonne.BOOLEAN,true,""))
    .pushColumn(new SycadTableColonne("dateMajPlan","Date Mise à jour",false,TypeColonne.DATE,true,""))

    .pushColumn(new SycadTableColonne("attributaire.pieceOfficielle.categorie.libelle","Type de pièce",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("attributaire.pieceOfficielle.numero","N° Pièce",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("attributaire.pieceOfficielle.dateObtention","Date de la pièce",true,TypeColonne.DATE,true,""))
    .pushColumn(new SycadTableColonne("attributaire.emails[0].value","Email",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("attributaire.telephones[0].value","Téléphone",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("attributaire.nom","Nom",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("attributaire.prenoms","Prenom",true,TypeColonne.STRING,true,"",true,"attributaire_prenoms"))
    .pushColumn(new SycadTableColonne("attributaire.lieuNaissance","Lieu de naissance",true,TypeColonne.STRING,true,"",false))
    .pushColumn(new SycadTableColonne("attributaire.dateNaissance","Date de naissance",true,TypeColonne.STRING,true,"",false))
    .pushColumn(new SycadTableColonne("attributaire.profession","Profession",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("attributaire.activitePrincipale","Activité principale",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("attributaire.denomination","Dénomination",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("attributaire.sigle","Sigle",true,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("transmissionCreateur.transmission","Structure créatrice",false,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("parcelle.ilot.section.numero","Section",false,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("parcelle.ilot.numero","Ilot",false,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("numeroDePV","Numero du PV",false,TypeColonne.STRING,true,""))
    .pushColumn(new SycadTableColonne("numeroDePage","Numéro page pv",false,TypeColonne.STRING,true,""))

      this.monTableau.typeRessource="DossierSaisieAttributionResource";
      this.monTableau.isExport=true;

    this.monTableau.transformeToProcessus();

    this.loadComponent();


    this.initConfigAutocompleteEntetePV();
    this.recupererDonnees();


  }


  public async loadComponent() {
    this.componentFactories = [];
    const { SycadTableComponent,SycadTableModule } = await import('@sycadApp/libs/sycad-table/sycad-table.component');
    const moduleFactory = SycadTableModule instanceof NgModuleFactory ? SycadTableModule
      : (await this.compiler.compileModuleAsync(SycadTableModule));
    const moduleRef = moduleFactory.create(this.injector);
    const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(SycadTableComponent);
    this.anchor.clear();
    const tableauComponent = this.anchor.createComponent(componentFactory);
    tableauComponent.instance.tableDescription=this.monTableau;
    tableauComponent.instance.backendApiService=this.attributionparcelle;
    tableauComponent.instance.actions=this.actions;
    tableauComponent.instance.onAddData.subscribe($event =>  this.actionProcessus(new ActionProcessusEvent(null,null)));
    tableauComponent.instance.onGenericAction.subscribe($event =>  this.genericAction($event));
    tableauComponent.instance.onFinishExport.subscribe($event =>  this.finishExport($event));
    tableauComponent.instance.onActionProcessu.subscribe($event =>  this.actionProcessus($event));
    tableauComponent.instance.onPreviewData.subscribe($event =>  this.vueAttribution($event));
    tableauComponent.instance.refeshDataSubject=this.refeshDataSubject;
  }
  public finishExport(event: StatsExport) {
    this._snackBar.open(`Export attribution terminé. Fichier : ${event.fileName}, Taille : ${event.size}, Chargement : ${event.time} seconde(s) `, 'Ok', {
      duration: 4000
    });

  }
  public actionProcessus(context: ActionProcessusEvent) {
    if(context.numero){
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION}/edition`, context.numero,context.transition.code],{
        state: {
          context
        }
      });
    }else {
      this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION}/edition`]);

    }

  }

  public vueAttribution(attribution: AttributionParcelle){
     this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION}/view`, attribution.numero]);
   }

  public genericAction(context: GenericActionEvent) {
  }
  public onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'

    });
  }


  initSection() {
    if(!this.sectionRemoteAutocomplete.init) {
      this.sectionRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.sectionService);
      this.sectionRemoteAutocomplete.mapFunction=(section: Section)=>{
        if(section.numeroAncien) {
          section.libelle=section.numeroAncien+" - "+section.numero;
        }
        return section;
      }
    }
  }
  public onSearchSection(eventNgSelect) {
    this.sectionRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onChangeSection(section: Section) {
    this.initIlot();
    this.sectionChoisie=section?.numero;   this.formulaire.controls["ilot"].setValue(null);
    this.formulaire.controls["section"].setValue(section?.id);
    this.formulaire.controls["numeropv"].setValue(this.entetepv?.numero);
    this.sectionRemoteAutocomplete.initialList = [ section];
    this.ilot=null;
    this.onChange(null);
    this.ilotRemoteAutocomplete.params.set("section",section?.id);
    this.ilotRemoteAutocomplete.term.next("");
}
initIlot(){
  if(!this.ilotRemoteAutocomplete.init) {
    this.ilotRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.ilotService);
   this.ilotRemoteAutocomplete.mapFunction=(ilot: IlotElement)=>{
      if(ilot.numeroAncien) {
        ilot.libelle=ilot.numeroAncien+" - "+ilot.numero;
      }
      return ilot;
    }
  }
}
public onSearchIlot(eventNgSelect) {
  this.ilotRemoteAutocomplete.term.next(eventNgSelect.term);
}
  onChange: any = (_: Number) => {};
  public onChangeCommune(commune:CommuneAutocomplete) {

    this.formulaire.controls["section"].setValue(null);
    this.formulaire.controls["ilot"].setValue(null);
    this.onChange(null);
    this.initSection();

   this.ilotRemoteAutocomplete.listRessource$=of([])
   this.sectionRemoteAutocomplete.params.set("commune",commune?.id);
   this.sectionRemoteAutocomplete.term.next("");
  }
  public onChangeIlot(ilot: Ilot) {


    this.formulaire.controls["ilot"].setValue(ilot?.id);
    this.ilotChoisie=ilot?.numero;
 }

 recupererDonnees() {
  this.saisieDiffereeAttributionContexteService.recuperer().subscribe(
    data => {
      if (data) {
        let entetepvv: EntetePVAutocomplete = new EntetePVAutocomplete();
        entetepvv.numero = data.entetePVAttributionDossier.numero;
        entetepvv.commune = data.entetePVAttributionDossier.arrondissement.commune;
        entetepvv.cessionSource = data.entetePVAttributionDossier.cessionSource;
        entetepvv.objet = data.entetePVAttributionDossier.objet;
        entetepvv.libelle = `{ commune: ${entetepvv.commune.nom} - ${entetepvv.cessionSource.libelle} }`;
        this.entetepv=entetepvv;
        this.entetePVRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([entetepvv]);
        this.entetePVRemoteAutocomplete.initialList = [data.entetePVAttributionDossier];
        this.onChangeSection(data.section);
        this.onChangeCommune(data.entetePVAttributionDossier.arrondissement.commune);
        this.numeroDePage=data?.numeroPage;
        this.ilotChoisie=data?.ilot?.numero;
        this.sectionChoisie=data?.ilot?.section?.numero;
        this.formulaire.patchValue({
          numeroPage: data.numeroPage,
          entetepv: data.entetePVAttributionDossier.numero,
          section: data.section.id,
          ilot: data?.ilot?.id,
          numeropv: data.entetePVAttributionDossier.numero
        });
      }
    },
    errorResponse => {
      SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
    }
  );
}



}
