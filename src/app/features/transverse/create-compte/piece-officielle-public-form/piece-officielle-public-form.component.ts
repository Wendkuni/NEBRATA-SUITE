import { Component, OnInit, ViewChild, OnDestroy, OnChanges,forwardRef, SimpleChanges, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, ControlValueAccessor,NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { RemoteAutocomplete, RemoteAutocompleteCategoriePiece, FilterContextategoriePiece } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { Subject, Subscription, of } from 'rxjs';
import { DropzoneComponent, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { environment } from 'environments/environment';
import { ReCaptchaV3Service } from 'ng-recaptcha';

export interface PieceOfficiellePubliqueFormValue {
  id: number;
  categorie: number;
  dateExpiration: Date;
  dateObtention: Date;
  numero: string;
  autoriteDeDelivrance: string;
  lieuDeDelivrance: string;
  codeDownload?: string;
}

@Component({
  selector: 'app-piece-officielle-public-form',
  templateUrl: './piece-officielle-public-form.component.html',
  styleUrls: ['./piece-officielle-public-form.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PieceOfficiellePubliqueFormComponent), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class PieceOfficiellePubliqueFormComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges  {

  @Input()
  touched: boolean;

  @Input("formGroup")
  pieceOfficielle: FormGroup;

  @Input()
  contribuableType: string;

  @Input("public")
  apiPublic: Boolean;

 // @ViewChild("recaptchaPiece", { static: false })
 // public reCaptchaComponent: ReCaptchaComponent;

  @ViewChild(DropzoneComponent, { static: false })
  dropzoneComponentRef?: DropzoneComponent;

  private _onDestroy = new Subject<void>();

  @Input("showCateg")
  public showCateg = true;

  public today: Date = new Date();

  public codeCategoriePiece;

  public typePieceIdentiteRemoteAutocomplete = new RemoteAutocompleteCategoriePiece();

  onChange: any = (_: PieceOfficiellePubliqueFormValue) => {};

  onTouch: any = () => {};

  private subscription = new Subscription();
  private token;
  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    resizeWidth :300,
    resizeHeight :300,
    thumbnailHeight: 300,
    thumbnailWidth: 300,
    acceptedFiles: 'image/*,application/pdf',
    errorReset: null,
    cancelReset: null
  };

  get categorie() {return this.pieceOfficielle.get("categorie");}
  get dateObtention() {return this.pieceOfficielle.get("dateObtention");}
  get dateExpiration() { return this.pieceOfficielle.get("dateExpiration");}
  get numero() {return this.pieceOfficielle.get("numero");}
  get nip() { return this.pieceOfficielle.get('nip'); }
  get autoriteDeDelivrance() {return this.pieceOfficielle.get("autoriteDeDelivrance"); }
  get lieuDeDelivrance() {return this.pieceOfficielle.get("lieuDeDelivrance"); }
  get codeDownload() {return this.pieceOfficielle.get("codeDownload")};

   readCodeCategoriePiece = () => ['01', '03'].includes(this.codeCategoriePiece);

  constructor(
    private fb: FormBuilder,
    private mediaObserver: MediaObserver,
    public typePieceIdentiteService: CategoriePieceService,
    public reCaptchaV3Service : ReCaptchaV3Service
    ) { }

  public documentPiece = '';
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {


 //  // console.log("this.apiPublic",this.apiPublic)
    if(this.apiPublic){
      let that = this;
      this.config.url=environment.APPLICATION.UPLOAD_FILE_API_PUBLIC,
      this.config.transformFile=function(file, done) {
      //  that.reCaptchaComponent.reset();

      that.reCaptchaV3Service.execute('uploadPieceContribuableSycad')
      .subscribe((token) => {
        that.token=token;
        done(file);
      });

     };
    }


    if(this.pieceOfficielle.value?.codeDownload) {
      this.documentPiece=this.pieceOfficielle.value.codeDownload;
      this.codeDownload.setValue(null);
    }

    if(this.pieceOfficielle.value?.categorie) {
      this.typePieceIdentiteRemoteAutocomplete.listRessource$=of([this.pieceOfficielle.value.categorie]);
      this.typePieceIdentiteRemoteAutocomplete.initialList=[this.pieceOfficielle.value.categorie];

      this.pieceOfficielle.patchValue({
        categorie:this.pieceOfficielle.value.categorie.id

      });

      this.codeCategoriePiece=this.pieceOfficielle.value.categorie.code;
    }




    this.subscription.add(
      this.pieceOfficielle.valueChanges.subscribe((value: PieceOfficiellePubliqueFormValue) => {
        this.onChange(value);
      })
    );


    this.typePieceIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.typePieceIdentiteService, true, true);
    this.typePieceIdentiteRemoteAutocomplete.term.next(new FilterContextategoriePiece("",this.contribuableType));
  }
  public onChangeypePieceIdentite(event) {
   this.codeCategoriePiece=event.code;

//CNIB ou passport Burkina
      if(this.readCodeCategoriePiece()) {
        this.nip.setValidators(null);
      }else {
        this.nip.setValidators( Validators.compose([Validators.required, Validators.maxLength(150), Validators.minLength(2)]));
      }
      this.nip.updateValueAndValidity();


}

  public onSearchTypePieceIdentite(eventNgSelect) {
    let data = new FilterContextategoriePiece(eventNgSelect.term,this.contribuableType)
    this.typePieceIdentiteRemoteAutocomplete.term.next(data);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this.subscription.unsubscribe();
  }

  public onUploadError(args: any): void {
    this.dropzoneComponentRef.directiveRef.reset();
  }
  public resetDropZone(): void {
    this.dropzoneComponentRef.directiveRef.reset();
    this.codeDownload.setValue(null);
  }
  public onUploadSuccess(remoteResponse): void {
   this.codeDownload.setValue(remoteResponse[1].name);
  }
  public onUploadInit(args: any): void {

  }
  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['touched'] && simpleChanges['touched'].currentValue) {
      this.pieceOfficielle.markAllAsTouched();
    }
  }

  writeValue(value: null | PieceOfficiellePubliqueFormValue): void {
    if (value) {
      this.pieceOfficielle.reset(value);
    }
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: PieceOfficiellePubliqueFormValue) => {}): void {
    this.onTouch = fn;
  }

  public onSending(data): void {
    const formData = data[2];
    formData.append('token', this.token);
      }


      public onCaptchaResponse($event) {
      }

      public onCaptchaExpired() {
      }
}
