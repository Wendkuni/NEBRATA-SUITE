import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {CategoriePieceProcessus, Transition} from '@sycadApp/models/workflow/common/general';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {of, Subject, Subscription} from 'rxjs';
import {
  RemoteAutocomplete
} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {CategoriePiece} from '@sycadApp/models/data-references/contribuables/global.model';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DateAdapter} from '@angular/material/core';

export interface TransitionFormValue {
  id: number;
 nbExemplaire: number;
 obligatoire: boolean;
 categoriePiece: number;
}
@Component({
  selector: 'app-transition-form',
  templateUrl: './transition-form.component.html',
  styleUrls: ['./transition-form.component.scss']
})
export class TransitionFormComponent implements  OnInit{
  @Input()
  touched: boolean;
  @Input()
  transition: Transition;

  @Input("formGroup")
 transitions: FormGroup;
  private _onDestroy = new Subject<void>();

  public typePieceIdentiteRemoteAutocomplete = new RemoteAutocomplete<CategoriePiece>();

  onChange: any = (_: TransitionFormValue) => {};
  private subscription = new Subscription();
  onTouch: any = () => {};
  get nbExemplaire() {return this.transitions.get('nbExemplaire');}
  get obligatoire() {return this.transitions.get('obligatoire');}
  get categoriePiece() {return this.transitions.get('categoriePiece')}
  constructor( private fb: FormBuilder,
               private mediaObserver: MediaObserver,
               public _adapter: DateAdapter<any>,
               public _snackBar: MatSnackBar,
               public typePieceIdentiteService: CategoriePieceService)
  {}
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");
    this.typePieceIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.typePieceIdentiteService);
     if(this.transitions.value.id){
    if(this.transitions.value.categoriePiece){
       this.typePieceIdentiteRemoteAutocomplete.listRessource$=of([this.transitions.value.categoriePiece]);
       this.typePieceIdentiteRemoteAutocomplete.initialList=[this.transitions.value.categoriePiece];
     }

    this.transitions.patchValue({
      categoriePiece: this.transitions.value.categoriePiece
    });
     }
    this.subscription.add(
      this.transitions.valueChanges.subscribe((value: TransitionFormValue) => {
        this.onChange(value);
      })
    );
  }


  public onSearchTypePieceIdentite(eventNgSelect) {
    this.typePieceIdentiteRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
