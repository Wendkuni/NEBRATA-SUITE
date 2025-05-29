
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { DateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-section-form',
  templateUrl: './section-form.component.html',
  styleUrls: ['./section-form.component.scss']
})
export class SectionFormComponent implements OnInit {


  private _onDestroy = new Subject<void>();
  @Input("formGroup") sectionForm: FormGroup;
  
  get numero() { return this.sectionForm.get('numero'); }
  get numeroAncien() { return this.sectionForm.get('numeroAncien'); }

  
  constructor(
    private fb: FormBuilder,
    public _snackBar: MatSnackBar,
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
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
