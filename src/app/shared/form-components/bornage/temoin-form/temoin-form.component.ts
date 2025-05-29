import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfessionAutocomplete } from '@sycadApp/models/data-references/contribuables/global.model';
import { RemoteAutocomplete, RemoteAutocompleteCategoriePiece } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { of, Subject } from 'rxjs';
import {DateAdapter} from '@angular/material/core';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-temoin-form',
  templateUrl: './temoin-form.component.html',
  styleUrls: ['./temoin-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TemoinFormComponent implements  OnInit {

  private _onDestroy = new Subject<void>();
  @Input('formGroup') temoinForm: FormGroup;
  public maskTelephone = ['0', '0', '2', '2', '6', ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/];

  public professionRemoteAutocomplete = new RemoteAutocomplete<ProfessionAutocomplete>();

  public typePieceIdentiteRemoteAutocomplete =  new RemoteAutocompleteCategoriePiece();

  get id() { return this.temoinForm.get('id'); }
  get nom() { return this.temoinForm.get('nom'); }
  get prenoms() { return this.temoinForm.get('prenoms'); }
  get email() { return this.temoinForm.get('email'); }
  get genre() { return this.temoinForm.get('genre'); }
  get telephone() { return this.temoinForm.get('telephone'); }
  get profession() { return this.temoinForm.get('profession'); }
  get pieceOfficielle() { return this.temoinForm.get('pieceOfficielle'); }
 

  constructor(
   
    private fb: FormBuilder,
    public professionService: ProfessionService,
    public typePieceIdentiteService:CategoriePieceService,
    private route: ActivatedRoute,
    private mediaObserver: MediaObserver,
    private _adapter: DateAdapter<any>) {

      


    }

  
    

public activeMediaQuery = '';

    ngAfterContentInit() {
      this.mediaObserver.media$.subscribe((change: MediaChange) => {
        this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      });
    }
  ngOnInit(): void {
    this._adapter.setLocale("fr");

    this.professionRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.professionService);
    if(this.temoinForm.value.id && this.temoinForm.value.profession) {
      this.professionRemoteAutocomplete.listRessource$=of([this.temoinForm.value.profession]);
      this.professionRemoteAutocomplete.initialList=[this.temoinForm.value.profession];
      this.temoinForm.patchValue({   
        profession:this.temoinForm.value.profession.id
      });
    }
  

  }
  
  onSearchProfession(eventNgSelect){
      this.professionRemoteAutocomplete.term.next(eventNgSelect.term);
  }
    
  
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

 

 
}