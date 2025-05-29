import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '@sycadApp/models/data-references/system/model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-info-user-piece-complementaires',
  templateUrl: './info-user-piece-complementaires.component.html',
  styleUrls: ['./info-user-piece-complementaires.component.scss']
})
export class InfoUserPieceComplementairesComponent implements OnInit {

  @Input() pieces: any[];
  public pieceComplementaire$:Observable<any>;
  constructor() { }

  ngOnInit(): void {
    this.getPrincipal(this.pieces);
  }
  private getPrincipal(pieces){
    for (let index = 0; index < pieces?.length; index++) {
      if(pieces[index]?.principal === true) {
        this.pieceComplementaire$ = of(pieces[index]);
        break;
      }
    }
  }
}
