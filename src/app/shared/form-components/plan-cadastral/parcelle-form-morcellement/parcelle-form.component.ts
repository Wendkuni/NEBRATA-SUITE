import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';
import {BehaviorSubject,  Subject} from 'rxjs';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DateAdapter} from '@angular/material/core';


@Component({
  selector: 'app-parcelle-morcellement-form',
  templateUrl: './parcelle-form.component.html',
  styleUrls: ['./parcelle-form.component.scss']
})
export class ParcelleMorcellementFormComponent implements OnInit {

  @Input('formGroup')
  parcelles: FormArray;

  @Input('parcelle')
  parcelle: ParcelleElement;

  @Input('ordre')
  ordre ?: boolean;


  @Input('readonly')
  readonly?: boolean;


  public dataSource = new BehaviorSubject<AbstractControl[]>([]);

  public activeMediaQuery = '';

  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  constructor( private fb: FormBuilder,
               public _snackBar: MatSnackBar,
               public _adapter: DateAdapter<any>,
               private mediaObserver: MediaObserver) { }

  ngOnInit(): void {
    this._adapter.setLocale('fr');


    if(this.parcelles.controls.length > 0) {

      this.updateTableParcelle();

    }
  }

  displayedColumns: string[] = ['libelle', 'superficie', 'ordre',  'action'];


  createParcelle(parcelle: ParcelleElement=null) {

    if (parcelle == null) {
      return this.fb.group({
        id: [null],
        libelle: [null],
        ordre: [null],
        superficie: [null, Validators.compose([Validators.required])]
      });
    }else {
      return this.fb.group({
        id: [parcelle.id],
        libelle: [parcelle.libelle],
        ordre: [parcelle?.ordre],
        superficie: [parcelle.superficie, Validators.compose([Validators.required])],
      });
    }

  }
  addNewParcelle() {
    this.parcelles.insert(0, this.createParcelle());
    this.updateTableParcelle();
  }


  public supprimerParcelle(index){
    this.parcelles.removeAt(index);
    this.updateTableParcelle();
  }

  public updateTableParcelle() {
    this.dataSource.next(this.parcelles.controls);
  }

}
