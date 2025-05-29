import {Component, Input, OnInit} from '@angular/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject, of} from 'rxjs';
import {CompteElement} from '@sycadApp/models/data-references/contribuables/compte.model';

@Component({
  selector: 'app-form-physique-valider-compte',
  templateUrl: './form-physique-valider-compte.component.html',
  styleUrls: ['./form-physique-valider-compte.component.scss']
})
export class FormPhysiqueValiderCompteComponent implements OnInit {

  @Input('compteContribuable')
  compteContribuable: CompteElement;



  private _onDestroy = new Subject<void>();
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  constructor(private _snackBar: MatSnackBar, private mediaObserver: MediaObserver) {}

  ngOnInit(): void {
  }


}
