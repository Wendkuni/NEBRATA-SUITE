import {
  Component, EventEmitter,
  Input,
  OnInit,
  Output, ViewChild
} from '@angular/core';
import {CommonModule} from "@angular/common";
import {
  DropzoneComponent, DropzoneConfigInterface,
  DropzoneModule
} from "ngx-dropzone-wrapper";
import {
  FlexModule, MediaChange,
  MediaObserver
} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {NgSelectModule} from "@ng-select/ng-select";
import {PipesModule} from "@sycadApp/pipes/pipes.module";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from "@angular/forms";
import {Subject} from "rxjs";
import {
  DocumentType
} from "@sycadApp/models/data-references/system/document-type.model";

@Component({
  selector: 'app-document-pv-form',
  templateUrl: './document-pv-form.component.html',
  styleUrls: ['./document-pv-form.component.scss']
})
export class DocumentPvFormComponent implements OnInit {


  private _onDestroy = new Subject<void>();
  @Input("formGroup") documentForm: FormGroup;

  @Input()
  // public typeDocuments: DocumentType[];
  @Output("changeTypeDocument")
  @Input()
  estEditable = true;
  @Input()
  set typeDocuments(value: DocumentType[]) {
    this._typeDocuments = value;
    if (this._typeDocuments && this._typeDocuments.length > 0) {
      const defaultDocumentType = this._typeDocuments[0];
      this.documentForm.patchValue({
        documentType: defaultDocumentType.id,
        libelle: defaultDocumentType.libelle
      });

      this.onChangeTypeDocument(defaultDocumentType);
    }
  }
  public _typeDocuments: DocumentType[];
  public changeTypeDocument: EventEmitter<DocumentType> = new EventEmitter<DocumentType>();

  get libelle() { return this.documentForm.get('libelle'); }
  get numero() { return this.documentForm.get('numero'); }
  get pieceJointe() { return this.documentForm.get('pieceJointe'); }
  get dateValidite() { return this.documentForm.get('dateValidite'); }
  get documentType() { return this.documentForm.get('documentType'); }
  get dateDoc() { return this.documentForm.get('dateDoc'); }

  public documentPiece : []=[];
  public selectedDocumentType: DocumentType[] = [];
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
    }
    if (this.typeDocuments && this.typeDocuments.length > 0) {
      // Utilisez le premier élément du tableau
      const defaultDocumentType = this.typeDocuments[0];
      this.documentForm.patchValue({
        documentType: defaultDocumentType.id,
        libelle: defaultDocumentType.libelle
      });
    }

  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }




  public onChangeTypeDocument(event: DocumentType) {
    if (event && event.id) {
      const documentType = new DocumentType(); // Utilisez le constructeur de DocumentType

      documentType.id = event.id;
      documentType.libelle = event.libelle;
      documentType.estTitreFoncier = event.estTitreFoncier || false;
      documentType.estTitreParcelle = event.estTitreParcelle || false;
      documentType.actif = event.actif || false;

      this.changeTypeDocument.emit(documentType); // Émettre le changement
    } else {
      console.error("L'événement ne contient pas les propriétés requises.");
    }
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
