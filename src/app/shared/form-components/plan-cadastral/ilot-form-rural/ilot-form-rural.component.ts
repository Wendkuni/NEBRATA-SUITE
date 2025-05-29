
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { DateAdapter } from '@angular/material/core';
import { LocaliteAutocomplete, ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { DestinationParcelle } from '@sycadApp/models/bornage/destinationParcelle.model';
import { Quartier } from '@sycadApp/models/data-references/territoire/quartier.model';
import { ArrondissementElement, ArrondissementZone } from '@sycadApp/models/data-references/territoire/arrondissement.model';
import { Section } from '@sycadApp/models/data-references/contribuables/global.model';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { QuartierService } from '@sycadApp/services/data-references/territoire/quartier.service';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { ArrondissementZoneService } from '@sycadApp/services/data-references/territoire/arrondissement-zone.service';
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
 
@Component({
  selector: 'app-ilot-form-rural',
  templateUrl: './ilot-form-rural.component.html',
  styleUrls: ['./ilot-form-rural.component.scss']
})
export class IlotFormRuralComponent implements OnInit {

  @Input("formGroup")
  ilotForm: FormGroup;


  @Input("arrondissement")
  arrondissement: ArrondissementElement;

  public localiteRemoteAutocomplete = new RemoteAutocomplete<LocaliteAutocomplete>();
  public sectionRemoteAutocomplete = new RemoteAutocomplete<Section>();

  public dataSource = new BehaviorSubject<AbstractControl[]>([]);

  private _onDestroy = new Subject<void>();

  get numero() { return this.ilotForm.get('numero'); }
  get section() { return this.ilotForm.get('section'); }
  get numeroAncien() { return this.ilotForm.get('numeroAncien'); }
  get parcelles() { return this.ilotForm.controls.parcelles as FormArray; }


  public activeMediaQuery = '';

  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  constructor(
    private fb: FormBuilder,
    public _snackBar: MatSnackBar,
    public _adapter: DateAdapter<any>,
    private mediaObserver: MediaObserver,
    public localiteService: LocaliteService,
    public sectionService: SectionService,
    ) {}


  ngOnInit(): void {
    this._adapter.setLocale("fr");
    this.localiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.localiteService);
    this.sectionRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.sectionService);
    this.sectionRemoteAutocomplete.params.set("commune",this.arrondissement.commune.id);
    this.localiteRemoteAutocomplete.params.set("arrondissement",this.arrondissement.id);


    if(this.ilotForm.value?.section) {
      this.sectionRemoteAutocomplete.listRessource$=of([this.ilotForm.value.section]);
      this.sectionRemoteAutocomplete.initialList=[this.ilotForm.value.section];
     this.ilotForm.patchValue({
       section:this.ilotForm.value.section.id
     });
    }

    if(this.parcelles.controls.length>0) {


      let idFilterLocalite=[];
      let lesLocalites=[];

      for (let index = 0; index < this.parcelles.controls.length; index++) {
        let parcelleFormCotrol =  this.parcelles.controls[index];
        let localite=parcelleFormCotrol.value.localite;

        if( idFilterLocalite.indexOf(localite.id)<0) {
          lesLocalites.push(localite);
          idFilterLocalite.push(localite.id)
        }
        parcelleFormCotrol.get("localite").setValue(localite.id);
      }

      this.localiteRemoteAutocomplete.listRessource$=of(lesLocalites);
      this.localiteRemoteAutocomplete.initialList=lesLocalites;

      this.updateTableParcelle();

    }




  }
  ngOnDestroy() {



    this._onDestroy.next();
    this._onDestroy.complete();

    this.addNewParcelle();
  }

  displayedColumns: string[] = ['numero', 'numeroAncien', 'libelle','superficie','localite','action'];


  createParcelle(parcelle:ParcelleElement=null) {

    if(parcelle==null) {
      return this.fb.group({
        id: [null],
        numero: [null, Validators.compose([Validators.required])],
        numeroAncien: [null],
        libelle: [null],
        superficie: [null, Validators.compose([Validators.required])],
        localite: [null, Validators.compose([Validators.required])],
      });
    }else {
      return this.fb.group({
        id: [parcelle.id],
        numero: [parcelle.numero, Validators.compose([Validators.required])],
        numeroAncien: [parcelle.numeroAncien],
        libelle: [parcelle.libelle],
        superficie: [parcelle.superficie, Validators.compose([Validators.required])],
        localite: [parcelle.localite?.id, Validators.compose([Validators.required])],
      });
    }

  }
  addNewParcelle() {
    this.parcelles.insert(0, this.createParcelle());
    this.updateTableParcelle();
  }
  public onSearchLocalite(eventNgSelect){
    this.localiteRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchSection(eventNgSelect){
    this.sectionRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public supprimerParcelle(index){
   this.parcelles.removeAt(index);
  this.updateTableParcelle();
  }

  public updateTableParcelle() {
    this.dataSource.next(this.parcelles.controls);
  }

}
