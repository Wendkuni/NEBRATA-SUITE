import {
  Component,
 Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {of, Subject, Subscription} from "rxjs";
import {LocaliteAutocomplete} from "@sycadApp/models/data-references/territoire/localite.model";
import {Quartier} from "@sycadApp/models/data-references/territoire/quartier.model";
import {RemoteAutocomplete} from "@sycadApp/shared/form-components/model/remote-autocomplete";
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { QuartierService } from '@sycadApp/services/data-references/territoire/quartier.service';
import {MediaChange, MediaObserver} from "@angular/flex-layout";


@Component({
  selector: 'app-localisation',
  templateUrl: './localisation.component.html',
  styleUrls: ['./localisation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})


export class LocalisationComponent implements OnInit {

  public localiteRemoteAutocomplete =  new RemoteAutocomplete<LocaliteAutocomplete>();
  public quartierRemoteAutocomplete = new RemoteAutocomplete<Quartier>();

  private _onDestroy = new Subject<void>();
  @Input("formGroup") localisationForm: FormGroup;

  @Input() noManagedPrincipal: boolean;

  get longitude() { return this.localisationForm.get('longitude');}
  get lattitude() { return this.localisationForm.get('lattitude');}
  get designation() { return this.localisationForm.get('designation');}
  get  localite() { return this.localisationForm.get(' localite');}
  get quartier() { return this.localisationForm.get('quartier');}
  get rue() { return this.localisationForm.get('rue');}
  get immeuble() { return this.localisationForm.get('immeuble');}
  get etage() { return this.localisationForm.get('etage');}
  get porte() { return this.localisationForm.get('porte');}
  get emailDeService() { return this.localisationForm.get('emailDeService');}
  get telephoneDeService() { return this.localisationForm.get('telephoneDeService');}



  constructor( public localiteService: LocaliteService,
               public quartierService: QuartierService,
               private fb: FormBuilder,
               private mediaObserver: MediaObserver) {}

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  ngOnInit(): void {
    this.localiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.localiteService);
    this.quartierRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.quartierService);

    if(this.localisationForm.value && this.localisationForm.value.localite) {
      this.localiteRemoteAutocomplete.listRessource$=of([this.localisationForm.value.localite]);
      this.localiteRemoteAutocomplete.initialList=[this.localisationForm.value.localite];
     
    }
    if(this.localisationForm.value && this.localisationForm.value.quartier) {
      this.quartierRemoteAutocomplete.listRessource$ =of([this.localisationForm.value.quartier]);
      this.quartierRemoteAutocomplete.initialList = [this.localisationForm.value.quartier];
    }

    if(this.localisationForm.value) {
      this.localisationForm.patchValue({
        quartier: this.localisationForm.value.quartier?.id,
        localite:this.localisationForm.value.localite?.id
    });
  }
  }

  public onSearchLocalite(eventNgSelect){
    this.localiteRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchQuartier(eventNgSelect){
    this.quartierRemoteAutocomplete.term.next(eventNgSelect.term);
  }
}
