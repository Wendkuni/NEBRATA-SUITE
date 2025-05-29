import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { DropzoneComponent, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import {CategoriePieceProcessus, Processus} from '@sycadApp/models/workflow/common/general';
import {DocumentType} from '@sycadApp/models/data-references/system/document-type.model';
import { environment } from 'environments/environment';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-document-parcelle-form',
  templateUrl: './document-parcelle-form.component.html',
  styleUrls: ['./document-parcelle-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentParcelleFormComponent implements OnInit {


  private token;

  private _onDestroy = new Subject<void>();
  @Input("formGroup") documentForm: FormGroup;


  //@ViewChild("recaptcahDocument", { static: false })
 // public reCaptchaComponent: ReCaptchaComponent;

  @Input()
  public typeDocuments: DocumentType [];
  @Output("changeTypeDocument")
  public changeTypeDocument: EventEmitter<DocumentType> = new EventEmitter<DocumentType>();

  get libelle() { return this.documentForm.get('libelle'); }
  get numero() { return this.documentForm.get('numero'); }
  get pieceJointe() { return this.documentForm.get('pieceJointe'); }
  //get dateValidite() { return this.documentForm.get('dateValidite'); }
  get documentType() { return this.documentForm.get('documentType'); }
  get dateDoc() { return this.documentForm.get('dateDoc'); }

  public documentPiece = '';

  @ViewChild(DropzoneComponent, { static: false })
  dropzoneComponentRef?: DropzoneComponent;

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
    cancelReset: null,
    url: environment.APPLICATION.UPLOAD_FILE_API_PUBLIC,
    withCredentials: true,
    paramName: "fichier",
    maxFilesize: 2, // MB
    createImageThumbnails: true,
  };

  constructor(
    public fb: FormBuilder,
    public mediaObserver: MediaObserver,
    public _snackBar: MatSnackBar,
    public reCaptchaV3Service : ReCaptchaV3Service
    ) {

      let that = this;
     this.config.transformFile=function(file, done) {
      // that.reCaptchaComponent.reset();

      that.reCaptchaV3Service.execute('uploadDocumentParcelleSycad')
      .subscribe((token) => {
        that.token=token;
        done(file);
      });
    };


    }

    public activeMediaQuery = '';

    ngAfterContentInit() {
      this.mediaObserver.media$.subscribe((change: MediaChange) => {
        this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      });
    }
  ngOnInit(): void {




  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  public onChangeTypeDocument($event) {
  }
  public onUploadError(args: any): void {
    this.dropzoneComponentRef.directiveRef.reset();
  }
  public resetDropZone(): void {
    this.dropzoneComponentRef.directiveRef.reset();
    this.pieceJointe.setValue(null);
  }
  public onUploadSuccess(remoteResponse): void {
   this.pieceJointe.setValue(remoteResponse[1].name);
  }
  public onUploadInit(args: any): void {

  }
  public onSending(data): void {
    const formData = data[2];
    formData.append('token', this.token);
      }


      public onCaptchaResponse($event) {
     //  // console.log("response ",$event)
      }

      public onCaptchaExpired() {
       // console.log("onCaptchaExpired ")
      }
}
