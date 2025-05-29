import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeneralContribuable } from '@sycadApp/models/data-references/contribuables/global.model';

@Component({
  selector: 'app-rapide-contribuable-form',
  templateUrl: './rapide-contribuable-form.component.html',
  styleUrls: ['./rapide-contribuable-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RapideContribuableFormComponent implements OnInit {

  @Input("updateContribuableUid")
  public updateContribuableUid: any = null;
  public updateContribuableType: number = -1;

  public isLoadingResults = false;
  public contribuable: GeneralContribuable;
  constructor(
     private mediaObserver: MediaObserver,
     public dialogRef: MatDialogRef<RapideContribuableFormComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any, ) {
        if(data != null){

          this.updateContribuableUid = data.guid?.guid;
          if(data.guid?.isPhysique){
            this.updateContribuableType = 0;
          }
          if(data.guid?.isMoral){
            this.updateContribuableType = 1;
          }
          if(data.guid?.isIndivision){
            this.updateContribuableType = 2;
          }
        }
      }

  public activeMediaQuery = '';

  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {
  }

  closeFormModal(): void {
    this.dialogRef.close(this.contribuable);
  }

  ajouterContribuable(contribuable: GeneralContribuable) {
    if(contribuable){
      this.contribuable=contribuable;
      this.closeFormModal();
    }
  }


  }
