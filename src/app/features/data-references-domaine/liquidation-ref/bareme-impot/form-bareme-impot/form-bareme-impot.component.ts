import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {of, Subject} from 'rxjs';
import {BaremeImpot} from '@sycadApp/models/impot/bareme-impot.model';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {DestinationParcelle} from '@sycadApp/models/bornage/destinationParcelle.model';
import {NatureImpot} from '@sycadApp/models/impot/nature-impot.model';
import {DegreSuccessoral} from '@sycadApp/models/evaluation/degre-successoral.model';
import {ArrondissementAutocomplete} from '@sycadApp/models/data-references/territoire/arrondissement.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {DateAdapter} from '@angular/material/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { BaremeImpotService } from '@sycadApp/services/impot/bareme-impot.service';
import { NatureImpotService } from '@sycadApp/services/impot/nature-impot.service';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { DegreSuccessoralService } from '@sycadApp/services/evaluation/degre-successoral.service';
import {takeUntil} from 'rxjs/operators';
import {getErrors} from '@sycadShared/validators/global-pattern';
import {SycadUtils} from '@sycadShared/utils.functions';
import { environment } from 'environments/environment';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { ProcessusService } from '@sycadApp/services/workflow/processus.service';
import { Processus } from '@sycadApp/models/workflow/common/general';
import {
  CessionSource
} from "@sycadApp/models/workflow/common/attribution-source.model";
import {
  CessionSourceService
} from "@sycadApp/services/impot/cession-source.service";


@Component({
  selector: 'app-form-bareme-impot',
  templateUrl: './form-bareme-impot.component.html',
  styleUrls: ['./form-bareme-impot.component.scss']
})
export class FormBaremeImpotComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults = false;
  public baremeImpot: BaremeImpot;
  public communeId: number;
  isTrancheMin:boolean=false;
  isTrancheMax:boolean=false;


  transMinDefautValue=0;
  transMaxDefatultValue=999999999;

  public destinationRemoteAutocomplete = new RemoteAutocomplete<DestinationParcelle>();
  public natureImpotRemoteAutocomplete = new RemoteAutocomplete<NatureImpot>();
  public degreSuccessoralRemoteAutocomplete = new RemoteAutocomplete<DegreSuccessoral>();
  public arrondissementRemoteAutocomplete = new RemoteAutocomplete<ArrondissementAutocomplete>();
  public communeRemoteAutocomplete=new RemoteAutocomplete<CommuneAutocomplete>();
  public processusRemoteAutocomplete=new RemoteAutocomplete<Processus>();
  public cessionSourceRemoteAutocomplte = new RemoteAutocomplete<CessionSource>();
  groupByFnArrondissement = (item) => item.commune.nom;
  groupValueFnArrondissement = (_: string, communes: any[]) => ({ name: communes[0].commune.nom, total: communes.length });


  get trancheMin(){return this.formulaire.get('trancheMin');}
  get trancheMax(){return this.formulaire.get('trancheMax');}
  get valeur() {return this.formulaire.get('valeur');}
  get taux(){return this.formulaire.get('taux');}
  get unite(){ return this.formulaire.get('unite');}
  get etatMev(){return this.formulaire.get('etatMev');}
  get domaine(){return this.formulaire.get('domaine');}
  get contribuableType(){return this.formulaire.get('contribuableType');}
  get natureImpot(){return this.formulaire.get('natureImpot');}
  get destination(){return this.formulaire.get('destination');}
  get arrondissement(){return this.formulaire.get('arrondissement');}
  get codeProcessus(){return this.formulaire.get('codeProcessus');}
  get degreSuccessoral(){return this.formulaire.get('degreSuccessoral');}
  get cessionSource(){return this.formulaire.get('cessionSource');}


  contribuableTypes = [
    "CONTRIBUABLEPHYSIQUE",
    "CONTRIBUABLEMORAL"
  ];
  domaines =[
    "ETAT",
    "PARTICULIER",
    "COLLECTIVITE"
  ];
  etatMevs = [
    "NU",
    "BATI"
  ];
  constructor(private router: Router,
              public confirmService: AppConfirmService,
              private route: ActivatedRoute, private mediaObserver: MediaObserver,
              private _adapter: DateAdapter<any>, private _snackBar: MatSnackBar,
              public fb: FormBuilder,public destinationParcelleService: DestinationParcelleService,
              public baremeImpotService: BaremeImpotService, public natureImpotService: NatureImpotService,
              public arrondissementService: ArrondissementsService,
              public degreSuccessoralService: DegreSuccessoralService,
              public communeService:CommunesService,
              public processusService:ProcessusService,
              public attributionSourceService: CessionSourceService)
  {
    this.baremeImpot = this.route.snapshot.data["baremeImpot"];

    this.formulaire = this.fb.group({
      id: [null],
      trancheMin: [this.transMinDefautValue],
      trancheMax: [this.transMaxDefatultValue],
      valeur: [null, [Validators.required]],
      taux: [null, [Validators.required]],
      unite: ["FCFA (XOF)"],
      destination: [null],
      codeProcessus:[null, [Validators.required]],
      etatMev: [null],
      degreSuccessoral: [null],
      domaine: [null],
      contribuableType:[null],
      natureImpot: [null, [Validators.required]],
      arrondissement: [null],
      cessionSource: [null, [Validators.required]]
    });
  }
  public formErrors: Array<string>;
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {

    this.formulaire.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.formErrors = getErrors(this.formulaire);
    });
    this._adapter.setLocale("fr");

    this.valeur.valueChanges.subscribe(x=>{
      if(x){
        this.taux.reset();
        this.taux.clearValidators();
        this.taux.updateValueAndValidity();
        this.valeur.setValidators(Validators.required);
      }

    });

    this.taux.valueChanges.subscribe(x=>{
      if(x){
        this.valeur.reset();
        this.valeur.clearValidators();
        this.valeur.updateValueAndValidity();
        this.taux.setValidators(Validators.required);
      }

    });
    this.trancheMin.valueChanges.subscribe(tranMin=>{
      if(tranMin>=this.trancheMax.value || this.trancheMin.value >=this.trancheMax.value ){
        this.isTrancheMin=true;
        this.isTrancheMax=false;
      }
      else if( this.trancheMin.value <this.trancheMax.value){
        this.isTrancheMax=false;
        this.isTrancheMin=false;
      }
    })


     this.trancheMax.valueChanges.subscribe(tranMax=>{
      if(tranMax<this.trancheMin.value || this.trancheMin.value >=this.trancheMax.value){

        this.isTrancheMax=true;
        this.isTrancheMin=false;
      }
      else if(this.trancheMin.value <this.trancheMax.value){
        this.isTrancheMin=false;
        this.isTrancheMax=false;
      }
    })
    console.log("Bareme:",this.baremeImpot);
    this.destinationRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.destinationParcelleService);
    this.natureImpotRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.natureImpotService);
    this.degreSuccessoralRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.degreSuccessoralService);
    this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementService);
    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
    this.processusRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.processusService)
    this.cessionSourceRemoteAutocomplte.initializeRemoteAutocompletion(this._onDestroy, this.attributionSourceService);
    if(this.baremeImpot){
      if(this.baremeImpot.destination){
        this.destinationRemoteAutocomplete.listRessource$=of([this.baremeImpot.destination]);
        this.destinationRemoteAutocomplete.initialList=[this.baremeImpot.destination];
      }
      if(this.baremeImpot.degreSuccessoral){
        this.degreSuccessoralRemoteAutocomplete.listRessource$=of([this.baremeImpot.degreSuccessoral]);
        this.degreSuccessoralRemoteAutocomplete.initialList=[this.baremeImpot.degreSuccessoral];
      }
      if(this.baremeImpot.natureImpot){
        this.natureImpotRemoteAutocomplete.listRessource$=of([this.baremeImpot.natureImpot]);
        this.natureImpotRemoteAutocomplete.initialList=[this.baremeImpot.natureImpot];
      }
      if(this.baremeImpot.arrondissement){
        this.arrondissementRemoteAutocomplete.listRessource$=of([this.baremeImpot.arrondissement]);
        this.arrondissementRemoteAutocomplete.initialList=[this.baremeImpot.arrondissement];
      }
      /* if(this.baremeImpot.arrondissement.commune){
        this.communeRemoteAutocomplete.listRessource$=of([this.baremeImpot.arrondissement.commune]);
        this.communeRemoteAutocomplete.initialList=[this.baremeImpot.arrondissement.commune];
        this.communeId=this.baremeImpot.arrondissement.commune?.id;
      } */
      if(this.baremeImpot.processus){
       //// console.log(this.baremeImpot.processus);
        this.processusRemoteAutocomplete.listRessource$=of([this.baremeImpot.processus]);
        this.processusRemoteAutocomplete.initialList=[this.baremeImpot.processus];
      }
      if(this.baremeImpot.cessionSource){
        this.cessionSourceRemoteAutocomplte.listRessource$=of([this.baremeImpot.cessionSource]);
        this.cessionSourceRemoteAutocomplte.initialList=[this.baremeImpot.cessionSource];
      }
      this.formulaire.patchValue({
        id: this.baremeImpot.id,
        trancheMin: this.baremeImpot.trancheMin,
        trancheMax: this.baremeImpot.trancheMax,
        contribuableType: this.baremeImpot.contribuableType,
        valeur: this.baremeImpot.valeur,
        taux: this.baremeImpot.taux,
        unite: this.baremeImpot.unite,
        domaine: this.baremeImpot.domaine,
        etatMev: this.baremeImpot.etatMev,
        natureImpot: this.baremeImpot.natureImpot?.id,
        destination: this.baremeImpot.destination?.id,
        codeProcessus:this.baremeImpot.processus?.code,
        degreSuccessoral: this.baremeImpot.degreSuccessoral?.id,
        arrondissement: this.baremeImpot.arrondissement?.id,
        cessionSource: this.baremeImpot.cessionSource?.id
      });
    }else {
      this.baremeImpot = new BaremeImpot();
    }
  }
  public onSearchDestination(eventNgSelect){
    this.destinationRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchNatureImpot(eventNgSelect){
    this.natureImpotRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchDegreSuccessoral(eventNgSelect){
    this.degreSuccessoralRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchArrondissement(eventNgSelect){
    this.arrondissementRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onChangeCommune(commune: CommuneAutocomplete) {

    this.arrondissementRemoteAutocomplete.params.set("commune", commune?.id);
    this.arrondissementRemoteAutocomplete.term.next("");
  }

  public onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchProcessus(eventNgSelect) {
    this.processusRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchCessionSource(eventNgSelect) {
    this.cessionSourceRemoteAutocomplte.term.next(eventNgSelect.term);
  }

  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.CONFIGURATION_BAREME_IMPOT}`]);

  }
  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {
          this.baremeImpotService.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Barème impôt modifié avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.CONFIGURATION_BAREME_IMPOT]);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        } else {
          this.baremeImpotService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("Barème impôt  ajouté avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.CONFIGURATION_BAREME_IMPOT]);
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
