import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-info-user-piece-officiellle',
  templateUrl: './info-user-piece-officiellle.component.html',
  styleUrls: ['./info-user-piece-officiellle.component.scss']
})
export class InfoUserPieceOfficiellleComponent implements OnInit {

  @Input() piece: any;
  public piece$:Observable<any>;
  constructor() { 

 
  }

  ngOnInit(): void {
   
  }
  /* private getPrincipal(piece){
        this.piece$ = of(piece);
  } */

}
