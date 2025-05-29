import { Component, OnInit, OnDestroy, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import {of, Subject} from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import {
  RemoteAutocomplete
} from "@sycadShared/form-components/model/remote-autocomplete";
import {
  TypeTransition
} from "@sycadApp/models/data-references/system/type-transition.model";
import {DateAdapter} from "@angular/material/core";
import {
  TypeTransitionService
} from "@sycadApp/services/data-references/system/type-transition.service";
import {
  DomaineFonctionnel
} from "@sycadApp/models/data-references/system/domaine-fonctionnel.model";
import {
  DomaineFonctionnelService
} from "@sycadApp/services/data-references/system/domaine-fonctionnel.service";




export interface TelephoneFormValue {
  id: number;
  numero: string;
  level: string;
  principal: boolean;
}

@Component({
  selector: 'app-transition-fonctionnelle-form',
  templateUrl: './transition-fonctionnelle-form.component.html',
  styleUrls: ['./transition-fonctionnelle-form.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TransitionFonctionnellesFormComponent), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class TransitionFonctionnellesFormComponent implements OnInit, OnDestroy {

  @Input()
  touched: boolean;
  private _onDestroy = new Subject<void>();
  @Input("formGroup")
  transitionFonctionnelleForm: FormGroup;

  public typeTransitionRemoteAutocomplete = new RemoteAutocomplete<TypeTransition>();
  public domaineFonctionnelRemoteAutocomplete = new RemoteAutocomplete<DomaineFonctionnel>();

  get typeTransition() {return this.transitionFonctionnelleForm.get('typeTransition');}

  onChange: any = (_: TelephoneFormValue) => {};
  onTouch: any = () => {};

  constructor(public _adapter: DateAdapter<any>,
              private mediaObserver: MediaObserver,
              private fb: FormBuilder,
              public typeTransitionService: TypeTransitionService,
              public domaineFonctionnelService: DomaineFonctionnelService) { }

  public activeMediaQuery = '';
  ngAfterContentInit() {
      this.mediaObserver.media$.subscribe((change: MediaChange) => {
        this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      });
    }

  ngOnInit(): void {
    this._adapter.setLocale("fr");
    this.typeTransitionRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.typeTransitionService);
    this.domaineFonctionnelRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.domaineFonctionnelService);

    if(this.transitionFonctionnelleForm.value.typeTransition){
      this.typeTransitionRemoteAutocomplete.listRessource$=of([this.transitionFonctionnelleForm.value.typeTransition]);
      this.typeTransitionRemoteAutocomplete.initialList= [this.transitionFonctionnelleForm.value.typeTransition];
      this.transitionFonctionnelleForm.patchValue({
        typeTransition: this.transitionFonctionnelleForm.value.typeTransition?.id
      });
    }
    if(this.transitionFonctionnelleForm.value.domaineFonctionnels) {
      this.domaineFonctionnelRemoteAutocomplete.listRessource$=of(this.transitionFonctionnelleForm.value.domaineFonctionnels);
      this.domaineFonctionnelRemoteAutocomplete.initialList=this.transitionFonctionnelleForm.value.domaineFonctionnels;
      this.transitionFonctionnelleForm.patchValue({
        domaineFonctionnels: this.transitionFonctionnelleForm.value.domaineFonctionnels.map(domaineFonctionnel => domaineFonctionnel.id),
      });
    }

  }

  onSearchTypeTransition(eventNgSelect){
    this.typeTransitionRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  onSearchDomaineFonctionnel(eventNgSelect){
    this.domaineFonctionnelRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: TelephoneFormValue) => {}): void {
    this.onTouch = fn;
  }


}
