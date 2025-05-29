import {
  Component, EventEmitter,
  Input,
  OnInit,
  Output, ViewChild
} from '@angular/core';
import {Subject} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {
  DocumentType
} from "@sycadApp/models/data-references/system/document-type.model";
import {
  DropzoneComponent,
  DropzoneConfigInterface
} from "ngx-dropzone-wrapper";
import {
  MediaChange,
  MediaObserver
} from "@angular/flex-layout";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-document-shapefile-scan',
  templateUrl: './document-shapefile-scan.component.html',
  styleUrls: ['./document-shapefile-scan.component.scss']
})
export class DocumentShapefileScanComponent implements OnInit {
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
    maxFilesize: 10,
    resizeWidth: 300,
    resizeHeight: 300,
    thumbnailHeight: 300,
    thumbnailWidth: 300,
    acceptedFiles: '.shp,.dbf,.shx,.prj,.sbn,.sbx,.fbn,.fbx,.ain,.aih,.ixs,.mxs,.atx,.cpg,.qix,.xml,image/*,application/pdf',
    errorReset: null,
    cancelReset: null,
    dictDefaultMessage: 'Cliquez ou déposez vos fichiers ici',
    dictFileTooBig: 'Le fichier est trop volumineux ({{filesize}}MB). Taille maximum : {{maxFilesize}}MB.',
    dictInvalidFileType: 'Type de fichier non autorisé.',
    parallelUploads: 5,
    addRemoveLinks: true,
    createImageThumbnails: true,
    accept: (file, done) => {
      const extension = file.name.toLowerCase().split('.').pop();
      // Liste des extensions autorisées
      const allowedShapefileExts = ['shp', 'dbf', 'shx', 'prj', 'sbn', 'sbx', 'fbn', 'fbx', 'ain', 'aih', 'ixs', 'mxs', 'atx', 'cpg', 'qix', 'xml'];
      const allowedImageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

      // Vérification du type de fichier
      if (allowedShapefileExts.includes(extension) ||
        allowedImageExts.includes(extension) ||
        extension === 'pdf' ||
        file.type.startsWith('image/') ||
        file.type === 'application/pdf') {
        done();
      } else {
        done(`Le type de fichier .${extension} n'est pas autorisé.`);
      }
    }
  };
  constructor(
    private fb: FormBuilder,public _snackBar: MatSnackBar,
    private mediaObserver: MediaObserver
  ) {}

  public activeMediaQuery = '';

  // Fonction pour obtenir l'icône appropriée selon le type de fichier
  public getFileIcon(fileName: string): string {
    const extension = fileName.toLowerCase().split('.').pop();
    const shapefileExts = ['shp', 'dbf', 'shx', 'prj', 'sbn', 'sbx', 'fbn', 'fbx', 'ain', 'aih', 'ixs', 'mxs', 'atx', 'cpg', 'qix', 'xml'];

    if (shapefileExts.includes(extension)) {
      return 'map';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return 'image';
    } else if (extension === 'pdf') {
      return 'picture_as_pdf';
    }
    return 'insert_drive_file';
  }
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
  // Méthode pour vérifier si tous les fichiers requis sont présents
  private checkRequiredShapefiles(files: string[]): boolean {
    const requiredExtensions = ['.shp', '.dbf', '.shx'];
    const uploadedExtensions = files.map(file =>
      '.' + file.split('.').pop().toLowerCase()
    );

    return requiredExtensions.every(ext =>
      uploadedExtensions.includes(ext)
    );
  }

  // Modification de la méthode onUploadSuccess pour vérifier les fichiers requis
  public onUploadSuccess(remoteResponse): void {

    let values: string[] = Array.isArray(this.pieceJointe.value) ?
      [...this.pieceJointe.value] : [];

    if (remoteResponse && remoteResponse[1] && remoteResponse[1].name) {
      values.push(remoteResponse[1].name);

      this.documentPiece = [];
      this.pieceJointe.setValue(values);

      // Vérification des fichiers shapefile
      const shapefileExtensions = values
        .map(file => file.toLowerCase().split('.').pop())
        .filter(ext => ['shp', 'dbf','prj', 'shx',''].includes(ext));

      if (shapefileExtensions.length >= 0 && shapefileExtensions.length < 4) {
        this.openSnackBar('Attention : Un shapefile complet nécessite au minimum les fichiers .shp, .dbf, .prj et .shx',"Ok");

      }
    } else {
      this.openSnackBar("Format de réponse inattendu: "+remoteResponse,"Ok");
    }
  }
  public onUploadInit(args: any): void {

  }
  // Ajout d'une méthode pour valider le groupe de fichiers
  public validateShapefileSet(): boolean {
    if (!this.pieceJointe.value) return false;

    const files = Array.isArray(this.pieceJointe.value) ?
      this.pieceJointe.value : [this.pieceJointe.value];

    return this.checkRequiredShapefiles(files);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: "top",
    });
  }

}
