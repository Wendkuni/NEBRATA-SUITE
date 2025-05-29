import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { GeneralContribuable } from '@sycadApp/models/data-references/contribuables/global.model';
import { RapideContribuableFormComponent } from '../rapide-contribuable-form/rapide-contribuable-form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MediaObserver } from '@angular/flex-layout';
import { IndivisionsService } from '@sycadApp/services/data-references/contribuables/indivisions.service';
import { ContribuablePhysiqueService } from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import { ContribuablePhysiqueNestedElement } from '@sycadApp/models/data-references/contribuables/indivisions.model';
import { ContribuableMoralService } from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-card-general-contribuable-form',
  templateUrl: './card-general-contribuable-form.component.html',
  styleUrls: ['./card-general-contribuable-form.component.scss']
})
export class CardGeneralContribuableFormComponent implements OnInit {

  public dialogRefRapideContribuableForm: MatDialogRef<RapideContribuableFormComponent,any>;

  @Input('contribuable')
  generalContribuable: GeneralContribuable;

  @Input('allow_edition')
  allow_edition: boolean = false;

  @Output() formAddModal: EventEmitter<any> = new EventEmitter<any>();

  @Input('titre')
  titre = 'Détail Attributaire';
  externAvatar = null;

  constructor(public dialog: MatDialog, public indivisionsService: IndivisionsService, public contribuablePhysiqueService: ContribuablePhysiqueService, public contribuableMoralService: ContribuableMoralService, private sanitizer: DomSanitizer, public mediaObserver: MediaObserver) { }

  ngOnInit(): void {
  }

  extractAfterLastSlash(text: string): string {
    const lastIndex = text.lastIndexOf('/');
    if (lastIndex === -1) {
      return text;
    }
    return text.substring(lastIndex + 1);
  }
  

  ngOnChanges(changes: SimpleChanges): void {
    this.generalContribuable["membres"] = [];
    this.generalContribuable["isPhysique"] = false;
    this.generalContribuable["isMoral"] = false;
    this.generalContribuable["isIndivision"] = false;
    this.generalContribuable["profession_str"] = this.generalContribuable.profession;

    if(this.generalContribuable.nom){
      this.generalContribuable["isPhysique"] = true;

      this.contribuablePhysiqueService.get(this.generalContribuable.guid).subscribe((contribuable) => {
        this.generalContribuable["profession"] = contribuable?.profession;
      });

      if(this.generalContribuable.avatar && this.generalContribuable.avatar.startsWith('http') && this.generalContribuable.avatar.indexOf('contribuable-physiques') == -1){
        try{
          const avatarPath = this.extractAfterLastSlash(this.generalContribuable.avatar);
  
          this.contribuablePhysiqueService.getAvatar(avatarPath).subscribe(blob => {
            const imageUrl = URL.createObjectURL(blob);
            this.externAvatar = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
          });
        } catch(Error){
          console.info("This doesn't look like a oni contact.");
        }
      }
    }

    else{
      this.contribuableMoralService.get(this.generalContribuable.guid).subscribe((fcontribuableMoral) => {

        if(fcontribuableMoral == null && this.generalContribuable.guid != null){

          this.generalContribuable["isIndivision"] = true;
          this.indivisionsService.get(this.generalContribuable.guid).subscribe((fcontribuable) => {
            if(fcontribuable != null){
              this.generalContribuable["membres"] = [];
              this.generalContribuable.dateDeCreation = fcontribuable?.dateDeCreation;
              this.generalContribuable.statusJuridique = fcontribuable?.statusJuridique;
              fcontribuable?.membres.forEach(membre => {
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
            }
            });
        } else {

          this.generalContribuable["isMoral"] = true;
          this.generalContribuable.dateDeCreation = fcontribuableMoral?.dateDeCreation;
          this.generalContribuable.statusJuridique = fcontribuableMoral?.statusJuridique;
        }
      });
    }
  }

  public openFormAddModal() {
    let guid: String = this.generalContribuable.guid;
    let isPhysique: Boolean = this.generalContribuable["isPhysique"];
    let isMoral: Boolean = this.generalContribuable["isMoral"];
    let isIndivision: Boolean = this.generalContribuable["isIndivision"];
    if( this.formAddModal) {
      this.formAddModal.emit({guid, isPhysique, isMoral, isIndivision});
    }

  }
}
