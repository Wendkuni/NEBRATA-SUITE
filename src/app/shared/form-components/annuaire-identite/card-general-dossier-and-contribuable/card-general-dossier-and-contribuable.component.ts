import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { GeneralContribuable } from '@sycadApp/models/data-references/contribuables/global.model';
import { RapideContribuableFormComponent } from '../rapide-contribuable-form/rapide-contribuable-form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MediaObserver } from '@angular/flex-layout';
import { IndivisionsService } from '@sycadApp/services/data-references/contribuables/indivisions.service';
import { ContribuablePhysiqueService } from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import { ContribuablePhysiqueNestedElement } from '@sycadApp/models/data-references/contribuables/indivisions.model';
import { ContribuableMoralService } from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import { StatusJuridique } from '@sycadApp/models/data-references/system/model';
import {
  AttributionParcelle
} from "@sycadApp/models/workflow/sd-attribution.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  SdAttributionService
} from "@sycadApp/services/workflow/sd-attribution.service";
import {SycadUtils} from "@sycadShared/utils.functions";
import {
  environment
} from "../../../../../environments/environment";
import {Router} from "@angular/router";
@Component({
  selector: 'app-card-general-dossier-and-contribuable',
  templateUrl: './card-general-dossier-and-contribuable.component.html',
  styleUrls: ['./card-general-dossier-and-contribuable.component.scss']
})
export class CardGeneralDossierAndContribuableComponent implements OnInit {

  public dialogRefRapideContribuableForm: MatDialogRef<RapideContribuableFormComponent,any>;


  public generalContribuable: GeneralContribuable;

  @Input('allow_edition')
  allow_edition: boolean = false;
  public loadingEvent: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  @Output() formAddModal: EventEmitter<any> = new EventEmitter<any>();
  public dossierAttribution: AttributionParcelle;
  @Input('numero')
  numero:string;
  @Input('titre')
  titre = 'Détail Attributaire';
  constructor(public dialog: MatDialog, public indivisionsService: IndivisionsService,
              public contribuablePhysiqueService: ContribuablePhysiqueService,
              public contribuableMoralService: ContribuableMoralService,
              public _snackBar: MatSnackBar,
              private router: Router,
              public attributionService: SdAttributionService,
              public mediaObserver: MediaObserver) { }

  ngOnInit(): void {
    this.getDossierAttribution(this.numero);
  }





  getDossierAttribution(numero:string){
    this.attributionService.get(numero).subscribe(
      data=>{
        this.dossierAttribution=data;
        this.generalContribuable=this.dossierAttribution.attributaire;
        this.generalContribuable["isPhysique"] = false;
        this.generalContribuable["isMoral"] = false;
        this.generalContribuable["isIndivision"] = false;
        if(this.generalContribuable.nom){
          this.generalContribuable["isPhysique"] = true;
          this.contribuablePhysiqueService.get(this.generalContribuable.guid).subscribe((fmembre) => {
            this.generalContribuable["profession"] = fmembre.profession;
          });
        }
        else{
          this.contribuableMoralService.get(this.generalContribuable.guid).subscribe((fcontribuableMoral) => {

            if(fcontribuableMoral == null){

              this.generalContribuable["isIndivision"] = true;
              this.indivisionsService.get(this.generalContribuable.guid).subscribe((fcontribuable) => {
                this.generalContribuable["membres"] = [];
                this.generalContribuable.statusJuridique = fcontribuable.statusJuridique;
                fcontribuable.membres.forEach(membre => {
                  let membreActuel: ContribuablePhysiqueNestedElement = new ContribuablePhysiqueNestedElement();
                  membreActuel['qualite'] = membre.qualite.libelle;
                  membreActuel['sigle'] = membre.membre.sigle;

                  membreActuel['codeUnique'] = membre.membre.codeUnique;
                  membreActuel['nip'] = membre.membre.nip;
                  membreActuel['avatar'] = membre.membre.avatar;
                  membreActuel.nom = membre.membre.nom;
                  membreActuel.prenoms = membre.membre.prenoms;
                  membreActuel.lieuNaissance = membre.membre.lieuNaissance;
                  membreActuel.dateNaissance = membre.membre.dateNaissance;
                  this.generalContribuable["membres"]?.push(membreActuel);
                });
              });
            } else {

              this.generalContribuable["isMoral"] = true;
              this.generalContribuable.statusJuridique = fcontribuableMoral.statusJuridique;
            }
          });
        }

      },
      errorResponse=>{
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }

    )
  }

  ngOnChanges(changes: SimpleChanges): void {


    // if(changes['numero'] && changes['numero'].currentValue){
    //   this.attributionService.get(changes['numero'].currentValue).subscribe(
    //     data=>{
    //       this.dossierAttribution=data;
    //       console.log(this.dossierAttribution);
    //
    //       console.log(this.generalContribuable);
    //     },
    //     errorResponse=>{
    //       this.loadingEvent.emit(false);
    //       SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
    //     }
    //
    //   )
    //
    // }
    //  this.generalContribuable["membres"] = [];





  }
  public vueAttribution(attribution: AttributionParcelle){
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION}/view`, attribution.numero]);
  }
  public openFormAddModal() {
    let guid: String = this.generalContribuable.guid;
    if( this.formAddModal) {
      this.formAddModal.emit(guid);
    }

  }
}
