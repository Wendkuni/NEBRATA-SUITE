import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { BureauAutocomplete } from '@sycadApp/models/data-references/organigramme/bureau.model';

import { StructureAutocomplete } from '@sycadApp/models/data-references/organigramme/structure.model';
import { ServiceAutocomplete } from '@sycadApp/models/data-references/organigramme/service.model';
import { DateAdapter } from '@angular/material/core';
import { ServiceAdministratifService } from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import { BureauService } from '@sycadApp/services/data-references/organigramme/bureau.service';

@Component({
  selector: 'app-transmission-createur',
  templateUrl: './transmission-createur.component.html',
  styleUrls: ['./transmission-createur.component.scss']
})
export class TransmissionCreateurComponent implements OnInit {


  private _onDestroy = new Subject<void>();
  @Input("formGroup") transmissionCreateurForm: FormGroup;

  public bureauRemoteAutocomplete = new RemoteAutocomplete<BureauAutocomplete>();
  public structureRemoteAutocomplete = new RemoteAutocomplete<StructureAutocomplete>();
  public serviceRemoteAutocomplete = new RemoteAutocomplete<ServiceAutocomplete>();

  get bureau(){ return this.transmissionCreateurForm.get('bureau');}
  get service(){ return this.transmissionCreateurForm.get('service');}
  get structure(){ return this.transmissionCreateurForm.get('structure');}


  constructor(
    private fb: FormBuilder,
    public bureauService : BureauService,
    public structureService : StructureService,
    public serviceAdminService : ServiceAdministratifService,
    public _adapter: DateAdapter<any>,
    private mediaObserver: MediaObserver
    ) {}
  public activeMediaQuery = '';

    ngAfterContentInit() {
      this.mediaObserver.media$.subscribe((change: MediaChange) => {
        this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      });
    }
  ngOnInit(): void {


    this._adapter.setLocale("fr");

    this.bureauRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.bureauService);
    this.serviceRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.serviceAdminService);
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
  }
  public onSearchBureau(eventNgSelect) {
    this.bureauRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchService(eventNgSelect) {
    this.serviceRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchStructure(eventNgSelect) {
    this.structureRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onChangeStructure(structure:StructureAutocomplete) {

    this.serviceRemoteAutocomplete.resetParams();
    this.service.reset();

    this.bureauRemoteAutocomplete.resetParams();
    this.bureau.reset();
    if(structure){
      this.serviceRemoteAutocomplete.params.set("structure",structure.code);
      this.serviceRemoteAutocomplete.term.next("");


      this.bureauRemoteAutocomplete.params.set("structure",structure.code);
      this.bureauRemoteAutocomplete.term.next("");
    }


  }
  customSearchFn(term: string, item: any) {
    return 1;
 }
  public onChangeService(service:ServiceAutocomplete) {

    this.bureauRemoteAutocomplete.resetParams();
    this.bureau.reset();

    if(service) {
      this.bureauRemoteAutocomplete.params.set("service",service.code);
      this.bureauRemoteAutocomplete.term.next("");
    }

  }

}
