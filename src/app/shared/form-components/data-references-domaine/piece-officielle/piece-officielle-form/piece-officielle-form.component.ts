import { Component, OnInit, ViewChild, OnDestroy, OnChanges,forwardRef, SimpleChanges, Input, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor,NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { RemoteAutocompleteCategoriePiece, FilterContextategoriePiece } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { Subject, Subscription, of } from 'rxjs';
import { DropzoneComponent, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { environment } from 'environments/environment';
import { ReCaptchaV3Service } from 'ng-recaptcha';

export interface PieceOfficielleFormValue {
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
  selector: 'app-piece-officielle-form',
  templateUrl: './piece-officielle-form.component.html',
  styleUrls: ['./piece-officielle-form.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PieceOfficielleFormComponent), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class PieceOfficielleFormComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges  {

  @Input()
  touched: boolean;

  @Input("formGroup")
  pieceOfficielle: FormGroup;

  @Input()
  contribuableType: string;

  @Input("public")
  apiPublic: Boolean;

  @ViewChild(DropzoneComponent, { static: false })
  dropzoneComponentRef?: DropzoneComponent;

  private _onDestroy = new Subject<void>();

  @Input("showCateg")
  public showCateg = true;

  public today: Date = new Date();

  public typePieceIdentiteRemoteAutocomplete = new RemoteAutocompleteCategoriePiece();

  onChange: any = (_: PieceOfficielleFormValue) => {};

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

  constructor(
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

    if(this.apiPublic){
      let that = this;
      this.config.url=environment.APPLICATION.UPLOAD_FILE_API_PUBLIC,
      this.config.transformFile=function(file, done) {

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
    }




    this.subscription.add(
      this.pieceOfficielle.valueChanges.subscribe((value: PieceOfficielleFormValue) => {
        this.onChange(value);
      })
    );


    this.typePieceIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.typePieceIdentiteService,true);
    this.typePieceIdentiteRemoteAutocomplete.term.next(new FilterContextategoriePiece("",this.contribuableType));
  }
  public onChangeypePieceIdentite(event) {
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

  writeValue(value: null | PieceOfficielleFormValue): void {
    if (value) {
      this.pieceOfficielle.reset(value);
    }
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: PieceOfficielleFormValue) => {}): void {
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
