import { Component, OnInit, ViewChild, OnDestroy, OnChanges,forwardRef, SimpleChanges, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormGroup,
} from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { DropzoneComponent, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DossierPieceFormValue {
  id: number;
  categorie: number;
  dateExpiration: Date;
  dateDelivrance: Date;
  reference: string;
  autoriteDeDelivrance: string;
  observation: string;
  pieceJointe?: string;
}

@Component({
  selector: 'app-dossier-piece-form',
  templateUrl: './dossier-piece-form.component.html',
  styleUrls: ['./dossier-piece-form.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DossierPieceFormComponent), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class DossierPieceFormComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges  {

  @Input()
  touched: boolean;

  @Input("formGroup")
  dossierPiece: FormGroup;

  @Input()
  categoriePieceProcessus: CategoriePieceProcessus[];

  @Output("changeCategoriePiece")
  public changeCategoriePiece: EventEmitter<CategoriePieceProcessus> = new EventEmitter<CategoriePieceProcessus>();

  maxSize: number = 0;
  public today: Date = new Date();

  @ViewChild(DropzoneComponent, { static: false })
  dropzoneComponentRef?: DropzoneComponent;
  public piecesJointes: string[] = [];

  private _onDestroy = new Subject<void>();

  onChange: any = (_: DossierPieceFormValue) => {};

  onTouch: any = () => {};

  private subscription = new Subscription();

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: null,
    autoReset: null,
    resizeWidth :300,
    resizeHeight :300,
    thumbnailHeight: 300,
    thumbnailWidth: 300,
    acceptedFiles: 'image/*,application/pdf',
    errorReset: null,
    cancelReset: null
  };

  get categorie() {return this.dossierPiece.get("categorie");}
  get dateDelivrance() {return this.dossierPiece.get("dateDelivrance");}
  get dateExpiration() { return this.dossierPiece.get("dateExpiration");}
  get reference() {return this.dossierPiece.get("reference");}
  get observation() { return this.dossierPiece.get('observation'); }
  get autoriteDeDelivrance() {return this.dossierPiece.get("autoriteDeDelivrance"); }
  get pieceJointe() {return this.dossierPiece.get("pieceJointe")};

  constructor(
    private mediaObserver: MediaObserver,
    public _snackBar: MatSnackBar,
    public typePieceIdentiteService: CategoriePieceService
    ) {}

  public documentPiece : []=[];
  public categoriePieceProcessusChoisie:CategoriePieceProcessus;
  public isNotFixedValue:boolean=true;
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });


  }
  ngOnInit(): void {
    this.categoriePieceProcessus = this.categoriePieceProcessus.filter(piece => piece.estAffiche);
    if(this.dossierPiece.value.id || (this.dossierPiece.value.nip && this.dossierPiece.value.numero && this.dossierPiece.value.categorie)) {


     if(this.dossierPiece.value.categorie) {

   this.categoriePieceProcessusChoisie=this.dossierPiece.value.categorie;


   this.isNotFixedValue=false;

   this.categoriePieceProcessus=[this.dossierPiece.value.categorie]
      this.dossierPiece.patchValue({
        categorie:this.dossierPiece.value.categorie.id

      });
     }

     if(this.dossierPiece.value.pieceJointe) {
      this.documentPiece=this.dossierPiece.value.pieceJointe;
      this.pieceJointe.setValue(null);
    }
    setTimeout(() => {
      this.changeCategoriePiece.emit(null);
    });
    }



    this.subscription.add(
      this.dossierPiece.valueChanges.subscribe((value: DossierPieceFormValue) => {
        this.onChange(value);
      })
    );



  }

  onChangeCategoriePiece($event: CategoriePieceProcessus){

    this.changeCategoriePiece.emit($event);
    this.categoriePieceProcessusChoisie=$event;
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this.subscription.unsubscribe();
  }

  public onUploadError(args: any): void {
    SycadUtils.notifyRemoteError({message: args[1]}, this._snackBar);
    this.dropzoneComponentRef.directiveRef.reset();
  }
  public resetDropZone(): void {
    this.dropzoneComponentRef.directiveRef.reset();
    this.pieceJointe.setValue(null);

  }
  public onUploadSuccess(remoteResponse): void {
    let values: string[] = Array.isArray(this.pieceJointe.value)
  ? [...this.pieceJointe.value]
  : [];
      values.push(remoteResponse[1].name);

      this.documentPiece=[];
     this.pieceJointe.setValue(values);
  }


  public onUploadInit(args: any): void {
    this.maxSize = args.options.maxFilesize;
  }
  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['touched'] && simpleChanges['touched'].currentValue) {
      this.dossierPiece.markAllAsTouched();
    }
  }

  writeValue(value: null | DossierPieceFormValue): void {
    if (value) {
      this.dossierPiece.reset(value);
    }
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: DossierPieceFormValue) => {}): void {
    this.onTouch = fn;
  }

}
