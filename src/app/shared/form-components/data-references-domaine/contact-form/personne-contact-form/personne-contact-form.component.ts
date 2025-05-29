import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder,FormGroup } from '@angular/forms';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { Subject, of } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Civilite } from '@sycadApp/models/data-references/system/model';
import { CiviliteService } from '@sycadApp/services/data-references/system/civilite-service.service';




@Component({
  selector: 'app-personne-contact-form',
  templateUrl: './personne-contact-form.component.html',
  styleUrls: ['./personne-contact-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PersonneContactFormComponent implements OnInit {

  private _onDestroy = new Subject<void>();
  @Input("formGroup") personneContactForm: FormGroup;
  public maskTelephone = ['0', '0', '2', '2', '6', ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/];

  get prenom() {return this.personneContactForm.get("prenom");}
  get nom() { return this.personneContactForm.get("nom");}
  get telephone() {return this.personneContactForm.get("telephone");}
  get profession() {return this.personneContactForm.get("profession");}
  get email() {return this.personneContactForm.get("email");}
  get civilite() {return this.personneContactForm.get("civilite");}
  get adresse() {return this.personneContactForm.get("adresse");}
  get genre() {return this.personneContactForm.get("genre");}



  constructor(
    private fb: FormBuilder,
    private mediaObserver: MediaObserver,
    public civiliteService : CiviliteService,
    ) {
    }


    public activeMediaQuery = '';
    ngAfterContentInit() {
      this.mediaObserver.media$.subscribe((change: MediaChange) => {
        this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      });
    }

  ngOnInit(): void {
    this.civilityRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.civiliteService);

    if(this.personneContactForm.value.id && this.personneContactForm.value.civilite) {
      this.civilityRemoteAutocomplete.listRessource$=of([this.personneContactForm.value.civilite]);
      this.civilityRemoteAutocomplete.initialList=[this.personneContactForm.value.civilite];
      this.personneContactForm.patchValue({   
        civilite:this.personneContactForm.value.civilite.id
      });
    }  
  }  
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  public civilityRemoteAutocomplete = new RemoteAutocomplete<Civilite>();
  public onSearchCivilite(eventNgSelect) {
    this.civilityRemoteAutocomplete.term.next(eventNgSelect.term);
  }
}
