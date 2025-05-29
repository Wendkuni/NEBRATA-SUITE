
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TransitionBornageDelimitationComponent } from '../transition-bornage-delimitation.component';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {BornageDelimitationService} from '@sycadApp/services/bornage/bornage-delimitation.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {MatDialog} from '@angular/material/dialog';
import {CategoriePieceProcessus} from '@sycadApp/models/workflow/common/general';
import {environment} from '../../../../../../environments/environment';
import {SycadUtils} from '@sycadShared/utils.functions';
import {of} from 'rxjs';
import {ParcelleDelimitation} from "@sycadApp/models/bornage/parcelle-delimitation.model";
import {Immeuble} from "@sycadApp/models/bornage/immeuble.model";
import {Temoin} from "@sycadApp/models/bornage/temoin.model";

@Component({
  selector: 'app-bornage-dossier',
  templateUrl: './bornage-dossier.component.html',
  styleUrls: ['./bornage-dossier.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BornageDossierComponent extends TransitionBornageDelimitationComponent implements OnInit {

  get delimitations() { return this.formulaire.controls.delimitations as FormArray; }
  get immeubles() { return this.formulaire.controls.immeubles as FormArray; }
  get temoins() { return this.formulaire.controls.temoins as FormArray; }


  constructor(public router: Router,
              public dialog: MatDialog,
              public _snackBar: MatSnackBar,
              public confirmService: AppConfirmService,
              public _adapter: DateAdapter<any>,
              public mediaObserver: MediaObserver,
              public fb: FormBuilder,
              public categoriePieceService: CategoriePieceService,
              public bornageDelimitationService: BornageDelimitationService,
              public acteurService: ActeursService,
              public contribuableService: ContribuableService,
              public structureService: StructureService,
              public parcelleService: ParcelleService, public mandatService: MandatService) {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService,bornageDelimitationService, acteurService, contribuableService, structureService,parcelleService,mandatService);

    this.formulaire =this.fb.group({
      numero: [null, [Validators.required]],
      action: [null, [Validators.required]],
      delimitations: new FormArray([]),
      immeubles: new FormArray([]),
      temoins: new FormArray([]),
      pieces: new FormArray([]),
    });


  }

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }


  ngOnInit(): void {

    this.formulaire.patchValue({
      numero: this.bornage.numero,
      action: this.transition.code
    });

    if (this.bornage.delimitations) {
      this.bornage.delimitations.map((parcelleDelimitation) => {
        this.delimitations.insert(0, this.createParcelleDelimitation(parcelleDelimitation));
      });
    }

    if (this.bornage.temoins) {
      this.bornage.temoins.map((temoin) => {
        this.temoins.insert(0, this.createTemoin(temoin));
      });
    }

    if (this.bornage.immeubles) {
      this.bornage.immeubles.map((immeuble) => {
        this.immeubles.insert(0, this.createImmeuble(immeuble));
      });
    }

    if (this.bornage.listPieces) {
      this.bornage.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
      });
    }
    this.categoriePieceProcessus$ = this.transition?.categoriePieces;
  }

  public categoriePieceProcessus$: CategoriePieceProcessus[] = [];
  public idCategoriePieceListChosen$: number[] = [];
  public changeCategoriePiece(data: CategoriePieceProcessus) {
    this.idCategoriePieceListChosen$ = [];
    for (let i = 0; i < this.pieces.length; i++) {
      let piece = this.pieces.at(i);
      this.idCategoriePieceListChosen$.push(piece.value.categorie);
    }
    let that = this;
    this.categoriePieceProcessus$ = this.transition?.categoriePieces.filter((piece) => {
      return (that.idCategoriePieceListChosen$.indexOf(piece.id) < 0);
    });

  }

  /**************** parcelle delimitation *********************/

  createParcelleDelimitation(delimitations: ParcelleDelimitation = null) {

    if (delimitations != null) {


      return this.fb.group({
        id: [delimitations.id],
        point: [delimitations.point, Validators.compose([Validators.required])],
        gpsX: [delimitations.gpsX, Validators.compose([Validators.required])],
        gpsY: [delimitations.gpsY, Validators.compose([Validators.required])],
        gissement: [delimitations.gissement],
        distance: [delimitations.distance, Validators.compose([Validators.required])],
        sens: [delimitations.sens, Validators.compose([Validators.required])],
        limitation: [delimitations.limitation]
      });
    } else {
      return this.fb.group({
        id: [null],
        point: [null, Validators.compose([Validators.required])],
        gpsX: [null, Validators.compose([Validators.required])],
        gpsY: [null, Validators.compose([Validators.required])],
        gissement: [null],
        distance: [null, Validators.compose([Validators.required])],
        sens: [null, Validators.compose([Validators.required])],
        limitation: null
      });
    }

  }
  addNewParcelleDelimitation() {
    this.delimitations.insert(0, this.createParcelleDelimitation());

  }
  removeParcelleDelimitation(index) {
    this.delimitations.removeAt(index);
  }
  /**************** fin parcelle delimitation *********************/

  /**************** immeubles *********************/

  createImmeuble(immeuble: Immeuble = null) {

    if (immeuble != null) {

      return this.fb.group({
        id: [immeuble.id],
        numero: [immeuble.numero, Validators.compose([Validators.required])],
        libelle: [immeuble.libelle, Validators.compose([Validators.required])],
        dimension: [immeuble.dimension, Validators.compose([Validators.required])],
        dateRealisation: [immeuble.dateRealisation],
        categorie: [immeuble.categorie, Validators.compose([Validators.required])],
        type: [immeuble.type, Validators.compose([Validators.required])],
        photos: [immeuble.photos]
      });
    } else {
      return this.fb.group({
        id: [null],
        numero: [null, Validators.compose([Validators.required])],
        libelle: [null, Validators.compose([Validators.required])],
        dimension: [null, Validators.compose([Validators.required])],
        dateRealisation: [null],
        categorie: [null, Validators.compose([Validators.required])],
        type: [null, Validators.compose([Validators.required])],
        photos: [null]
      });
    }

  }
  addNewImmeuble() {
    this.immeubles.insert(0, this.createImmeuble());

  }
  removeImmeuble(index) {
    this.immeubles.removeAt(index);
  }
  /**************** fin immeubles *********************/


  /**************** temoins *********************/

  createTemoin(temoin: Temoin = null) {

    if (temoin != null) {
      let form= this.fb.group({
        id: [temoin.id],
        prenoms: [temoin.prenoms, Validators.compose([Validators.required])],
        nom: [temoin.nom, Validators.compose([Validators.required])],
        genre: [temoin.genre, Validators.compose([Validators.required])],
        profession: [temoin.profession],
        telephone: [temoin.telephone, Validators.compose([Validators.required])],
        email: [temoin.email, Validators.compose([Validators.required])],
        pieceOfficielle: this.fb.group({
          categorie: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
          dateExpiration: [null],
          dateObtention: [null, Validators.compose([Validators.required])],
          numero: [null,
            Validators.compose([Validators.required, Validators.maxLength(150), Validators.minLength(2)]),
          ],
          nip: [null],
          autoriteDeDelivrance: [null],
          lieuDeDelivrance: [null],
          codeDownload: [null],
        })
      });
      form.patchValue({
        pieceOfficielle: {
          codeDownload: temoin.pieceOfficielle?.documentPiece,
        }
       });
      form.patchValue({
        pieceOfficielle:temoin.pieceOfficielle || {}
      })
      return form;

    } else {
      return this.fb.group({
        id: [null],
        prenoms: [null, Validators.compose([Validators.required])],
        nom: [null, Validators.compose([Validators.required])],
        genre: [null, Validators.compose([Validators.required])],
        profession: [null],
        telephone: [null, Validators.compose([Validators.required])],
        email: [null, Validators.compose([Validators.required])],
        pieceOfficielle: this.fb.group({
          categorie: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
          dateExpiration: [null],
          dateObtention: [null, Validators.compose([Validators.required])],
          numero: [null,
            Validators.compose([Validators.required, Validators.maxLength(150), Validators.minLength(2)]),
          ],
          nip: [null],
          autoriteDeDelivrance: [null],
          lieuDeDelivrance: [null],
          codeDownload: [null],
        })
      });
    }

  }
  addNewTemoin() {
    this.temoins.insert(0, this.createTemoin());

  }
  removeTemoin(index) {
    this.temoins.removeAt(index);
  }
  /**************** fin temoins *********************/



  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    }
    


    this.loadingEvent.emit(true);

    this.bornageDelimitationService.executer(this.formulaire.value).subscribe(data => {
      this.loadingEvent.emit(false);
        this.openSnackBar("Dossier de bornage modifié avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }
  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_BORNAGE_DELIMITATION}`]);
  }
}
