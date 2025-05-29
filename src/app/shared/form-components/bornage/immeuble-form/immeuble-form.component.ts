import {
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {of, Subject} from 'rxjs';
import {FormArray, FormGroup} from '@angular/forms';
import {RemoteAutocomplete} from '@sycadShared/form-components/model/remote-autocomplete';
import {CategorieImmeuble} from '@sycadApp/models/data-references/system/categorie-immeuble.model';
import {TypeImmeuble} from '@sycadApp/models/bornage/type-immeuble.model';
import {ParcelleAutocomplete, ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';
import {
  DropzoneComponent,
  DropzoneConfigInterface
} from 'ngx-dropzone-wrapper';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import {DateAdapter} from '@angular/material/core';
import {CategorieImmeubleService} from '@sycadApp/services/data-references/system/categorie-immeuble.service';
import {TypeImmeubleService} from '@sycadApp/services/bornage/type-immeuble.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {DossierBornage} from "@sycadApp/models/bornage/bornage.model";

@Component({
  selector: 'app-immeuble-form',
  templateUrl: './immeuble-form.component.html',
  styleUrls: ['./immeuble-form.component.scss']
})
export class ImmeubleFormComponent implements OnInit {
  private _onDestroy = new Subject<void>();
  @Input("formGroup") immeubleForm: FormGroup;

  // @Input("parcelleChoisie")
  // bornage: DossierBornage;


  public categorieRemoteAutocomplete = new RemoteAutocomplete<CategorieImmeuble>();
  public typeImmeubleRemoteAutocomplete = new RemoteAutocomplete<TypeImmeuble>();
  public parcelleRemoteAutocomplete = new RemoteAutocomplete<ParcelleAutocomplete>();

  @ViewChild(DropzoneComponent, { static: false })
  dropzoneComponentRef?: DropzoneComponent;
  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 100,
    autoReset: null,
    resizeWidth :300,
    resizeHeight :300,
    thumbnailHeight: 300,
    thumbnailWidth: 300,
    acceptedFiles: 'image/*',
    errorReset: null,
    cancelReset: null
  };
  get numero() {return this.immeubleForm.get("numero");}
  get libelle() {return this.immeubleForm.get("libele");}
  get dimension() {return this.immeubleForm.get("dimension");}
  get dateRealisation() { return this.immeubleForm.get("dateRealisation");}
  get photos() {return this.immeubleForm.get("photos");}
  // get parcelle() { return this.immeubleForm.get("parcelle");}
  get categorie() {return this.immeubleForm.get("categorie");}
  get type() { return this.immeubleForm.get("type");}


  constructor(public _adapter: DateAdapter<any>,
              private mediaObserver: MediaObserver,
              public categorieService: CategorieImmeubleService,
              public typeImmeubleService: TypeImmeubleService,
              public parcelleService: ParcelleService) { }
  public activeMediaQuery = '';
  public photosJointes = [];
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  ngOnInit(): void {
    this._adapter.setLocale("fr");
    this.categorieRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.categorieService);
    this.typeImmeubleRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.typeImmeubleService);
    this.parcelleRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.parcelleService);

    if(this.immeubleForm.value.categorie){
      this.categorieRemoteAutocomplete.listRessource$=of([this.immeubleForm.value.categorie]);
      this.categorieRemoteAutocomplete.initialList= [this.immeubleForm.value.categorie];
      this.immeubleForm.patchValue({
        categorie: this.immeubleForm.value.categorie?.id
      });
    }
    if(this.immeubleForm.value.type){
      this.typeImmeubleRemoteAutocomplete.listRessource$ = of([this.immeubleForm.value.type]);
      this.typeImmeubleRemoteAutocomplete.initialList = [this.immeubleForm.value.type];
      this.immeubleForm.patchValue({
        type: this.immeubleForm.value.type?.id
      });
    }

    if(this.immeubleForm.value.photos){
      this.photosJointes = this.immeubleForm.value.photos;
      this.photos.setValue([]);
    }
  }
  onSearchCategorie(eventNgSelect){
    this.categorieRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  onSearchTypeImmeuble(eventNgSelect){
    this.typeImmeubleRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  onSearchParcelle(eventNgSelect){
    this.parcelleRemoteAutocomplete.term.next(eventNgSelect.term);
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();

  }

  public onUploadError(args: any): void {
    this.dropzoneComponentRef.directiveRef.reset();
  }
  public resetDropZone(): void {
    this.dropzoneComponentRef.directiveRef.reset();
    this.photos.setValue([]);
  }
  public onUploadSuccess(remoteResponse): void {
   // console.log("this.photos.value",this.photos.value)
   // console.log("remoteResponse",remoteResponse)
 //   this.photos.insert(0, remoteResponse[1].name);
 
    let list = this.photos.value as Array<String>;

    list.push(remoteResponse[1].name);
    this.photos.setValue(list);
  }
  public onUploadInit(args: any): void {

  }
  removePhoto(index){
  //  this.photos.removeAt(index);
  }
}
