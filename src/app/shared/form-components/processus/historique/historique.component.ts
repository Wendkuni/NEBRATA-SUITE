import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { HistoriqueWorkflow } from '@sycadApp/models/workflow/common/general';
import { HistoriqueWorkflowService } from '@sycadApp/services/data-references/system/historique.service';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HistoriqueComponent implements OnInit {

  public panelOpenState = false;
  public historiques:Array<HistoriqueWorkflow>;

  @Input()
  public numero:String;

  constructor(public historiqueWorkflowService:HistoriqueWorkflowService) { }

  ngOnInit(): void {

    this.historiqueWorkflowService.list(this.numero).subscribe(list => {
      this.historiques=list;
    });
  }

}
