import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  EventEmitter,
  Output
} from '@angular/core';
import {forkJoin, Subject} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {map} from 'rxjs/operators';
import { of} from 'rxjs';
import { AdvancedRemoteAutocomplete } from './advanced-remote-autocomplete';
import { AutocompleteSycadTableComponent } from './autocomplete-sycad-table/autocomplete-sycad-table.component';

@Component({
  selector: 'app-field-remote-autocomplete',
  templateUrl: './field-remote-autocomplete.component.html',
  styleUrls: ['./field-remote-autocomplete.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class FieldRemoteAutocompleteComponent implements OnInit{
  private _onDestroy = new Subject<void>();
  public dialogRef: MatDialogRef<AutocompleteSycadTableComponent, any>;
  public activeMediaQuery = '';

  @Input('dataForm')
  dataForm: AdvancedRemoteAutocomplete<any>;

  @Output() subjectCompleteEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output() formAddModal: EventEmitter<any> = new EventEmitter<any>();

  constructor(private mediaObserver: MediaObserver, private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.dataForm.initializeRemoteAutocompletion(this._onDestroy);
    if (this.dataForm.listItemSelected  && this.dataForm.listItemSelected.length > 0) {
      this.setForm(this.dataForm.listItemSelected);
    }

    if (this.dataForm.itemSelected) {
      this.setForm(this.dataForm.itemSelected);
    }


  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  public onSearch(eventNgSelect) {
    this.dataForm.customNgSelectConfig.term.next(eventNgSelect.term);
  }

  // La fonction est vide parcequ'elle est héritée. Le script original se trouve dans le parent,
  // ici : src/app/features/cession-parcelle-domaine/saisie-differee-attribution/edition-sd-attribution/transition-sd-attribution.component.ts
  // C'est là qu'on peut toucher aux dimensions de la modale.
  public openFormAddModal() {
    if( this.formAddModal) {
      this.formAddModal.emit();
    }

  }
  public openTableauModal(){
    let { width,height,position}=this.getCorrectWidth();
    this.dialogRef = this.matDialog.open(AutocompleteSycadTableComponent, {
      data: this.dataForm,
      width: width,
      height: height,
      position: position,
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(dataForm => {
      this.setForm(dataForm);
    });

  }

  fieldChange(event){

    if (this.dataForm.customNgSelectConfig.multiple){
      this.dataForm.listItemSelected = event;
      this.subjectCompleteEvent.emit(this.dataForm.listItemSelected);

    } else {
      this.dataForm.itemSelected = event;
      this.subjectCompleteEvent.emit(this.dataForm.itemSelected);
    }
  }

  setForm(dataa){
    if (dataa) {
      let champ = null;
      const key  = this.dataForm.customNgSelectConfig.controlName;
      if (this.dataForm.customNgSelectConfig.multiple) {
        this.dataForm.listItemSelected = dataa;
        this.subjectCompleteEvent.emit(this.dataForm.listItemSelected);
        champ = dataa.map (item => item[this.dataForm.keyId]);
        champ  = {[key] :  champ};
      } else {
        this.dataForm.itemSelected = dataa;
        this.subjectCompleteEvent.emit(this.dataForm.itemSelected);
        champ = {[key] : dataa[this.dataForm.keyId]};
      }
      this.setNewValueOnList(dataa);
      this.dataForm.customNgSelectConfig.formulaire.patchValue(champ);

    }
  }

  ngAfterContentInit() {

    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';

      if(this.dialogRef) {
        let { width, height, position} = this.getCorrectWidth();
        this.dialogRef.updateSize(width, height);
        this.dialogRef.updatePosition(position);
      }

    });
  }

  private getCorrectWidth() {

    if (this.mediaObserver.isActive('xs')) {
      return {
        width: '95vw',
        height: '90vh',
        position: {
          top: '2vh',
        }
      };
    }

    if (this.mediaObserver.isActive('sm')) {
      return {
        width: '90vw',
        height: '90vh',
        position: {
          top: '2vh',
        }
      };
    }

    if (this.mediaObserver.isActive('md')) {
      return {
        width: '80vw',
        height: '90vh',
        position: {
          top: '2vh',
        }
      };
    }

    if (this.mediaObserver.isActive('lg')) {
      return {
        width: '70vw',
        height: '90vh',
        position: {
          top: '2vh',
        }
      };
    }
    if (this.mediaObserver.isActive('xl')) {
      return {
        width: '65vw',
        height: '90vh',
        position: {
          top: '2vh',
        }
      };
    }
  }

   existItem(data, id){
    return data.filter(x => x[this.dataForm.keyId] === id);
  }

  setNewValueOnList(dataa) {
    const  p = [];
    this.dataForm.customNgSelectConfig.listRessource$.pipe(
      map(x => {
        if (this.dataForm.customNgSelectConfig.multiple){
          dataa.map(datas => {
            if ((this.existItem(x,  datas[this.dataForm.keyId])).length === 0) {
              p.push(datas);
            }
          });
        } else {
          if ((this.existItem(x,  dataa[this.dataForm.keyId])).length === 0) {
            p.push(dataa);
          }
        }
      })).subscribe(data => {
      this.dataForm.customNgSelectConfig.listRessource$ = forkJoin(
        this.dataForm.customNgSelectConfig.listRessource$, of(p)).pipe(
        map(([items, otherItems]) => items.concat(otherItems)
        )
      );
    });
  }
}
