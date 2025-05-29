import { Component, OnInit, Input } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

import { ListItemState } from '@sycadApp/themes/utils/app-animation';

export class ArianeProcessus {
   libelle:string;
   current:boolean;
   constructor(libelle:string, current:boolean=false) {
    this.libelle=libelle;
    this.current=current;
   }
}

@Component({
  selector: 'app-fil-ariane-processus',
  templateUrl: './fil-ariane-processus.component.html',
  styleUrls: ['./fil-ariane-processus.component.scss'],
  animations: [
    ListItemState
  ] 
})
export class FilArianeProcessusComponent implements OnInit {

  @Input()
  public listEtapes: ArianeProcessus[];

  constructor( private mediaObserver: MediaObserver) {}


  public listEtapesActive: ArianeProcessus[]= [ ];
  public startIndex;
  public numberToShow;
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    // // console.log("this.activeMediaQuery", this.activeMediaQuery);

      if(this.activeMediaQuery==='xs') {
        this.numberToShow=2;
        
       }
      if(this.activeMediaQuery==='sm') { 
        this.numberToShow=3;
      }
      if(this.activeMediaQuery==='md') { 
        this.numberToShow=4;
      }
      if(this.activeMediaQuery==='lg') {
        this.numberToShow=5;
       }
      if(this.activeMediaQuery==='xl') { 
        this.numberToShow=5;
      }
      this.buildActiveList();
      
    });
  }

  ngOnInit() {
    this.buildActiveList();
    //center la file d'ariane

  }

  public previousEtape(){

   if(this.startIndex>0) {
    this.listEtapesActive=[];
     this.startIndex--;
     setTimeout(() => 
     {
      this.buildActiveList();
     });
   }
  }
  
  private buildActiveList() {

    if(!this.startIndex && !this.numberToShow){
      return ;
    }

     if(!this.startIndex){
       let index =  this.listEtapes.findIndex(x => x.current ===true);
        let dec=Math.floor(this.numberToShow/2);
        this.startIndex=(index-dec<0)?0:index-dec;
     }


    if(this.listEtapes)
    this.listEtapesActive=this.listEtapes.slice(this.startIndex,this.startIndex+this.numberToShow);
  }
  public nextEtape(){
   
    if(this.startIndex +this.numberToShow + 1 <this.listEtapes.length) {
      this.listEtapesActive=[];
      this.startIndex++;
      setTimeout(() => 
      {
        this.buildActiveList();
      } );
    }
  }
}
