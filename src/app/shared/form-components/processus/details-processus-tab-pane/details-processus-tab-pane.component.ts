import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Processus } from '@sycadApp/models/workflow/common/general';

@Component({
  selector: 'app-details-processus-tab-pane',
  templateUrl: './details-processus-tab-pane.component.html',
  styleUrls: ['./details-processus-tab-pane.component.scss']
})
export class DetailsProcessusTabPaneComponent {
  @Input() processus!:Processus
  public displayedColumnsTypeDocuements: string[] = ['code', 'libelle', 'estTitreFoncier', 'estTitreParcelle', 'actif'];
  public displayedColumnsCategoriePieces: string[] = ['categorie', 'libelle', 'exemplaire'];
  public displayedColumnsDestination: string[] = ['code', 'libelle', 'tutelle.nom'];


}
