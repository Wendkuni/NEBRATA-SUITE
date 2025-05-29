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

@Component({
  selector: 'app-document-scan-form',
  templateUrl: './document-scan-form.component.html',
  styleUrls: ['./document-scan-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentScanFormComponent implements OnInit {


  private _onDestroy = new Subject<void>();
  @Input("formGroup") documentForm: FormGroup;

  @Input()
  public typeDocuments: DocumentType [];
  @Output("changeTypeDocument")
  public changeTypeDocument: EventEmitter<DocumentType> = new EventEmitter<DocumentType>();

  get libelle() { return this.documentForm.get('libelle'); }
  get numero() { return this.documentForm.get('numero'); }
  get pieceJointe() { return this.documentForm.get('pieceJointe'); }
  get dateValidite() { return this.documentForm.get('dateValidite'); }
  get documentType() { return this.documentForm.get('documentType'); }
  get dateDoc() { return this.documentForm.get('dateDoc'); }

  public documentPiece : []=[];

  @ViewChild(DropzoneComponent, { static: false })
  dropzoneComponentRef?: DropzoneComponent;

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

  constructor(
    private fb: FormBuilder,
    private mediaObserver: MediaObserver
    ) {}

    public activeMediaQuery = '';

    ngAfterContentInit() {
      this.mediaObserver.media$.subscribe((change: MediaChange) => {
        this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      });
    }
  ngOnInit(): void {


     if(this.documentForm.value.pieceJointe) {
      this.documentPiece=this.documentForm.value.pieceJointe;
      this.pieceJointe.setValue(null);
    }

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
    let values: string[] = Array.isArray(this.pieceJointe.value)
  ? [...this.pieceJointe.value]
  : [];
      values.push(remoteResponse[1].name);

      this.documentPiece=[];
     this.pieceJointe.setValue(values);
  }
  public onUploadInit(args: any): void {

  }

}
