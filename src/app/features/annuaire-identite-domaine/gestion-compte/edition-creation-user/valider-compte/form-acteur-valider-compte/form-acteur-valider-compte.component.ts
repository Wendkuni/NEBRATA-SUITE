import {Component, Input, OnInit} from '@angular/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {Subject, of} from 'rxjs';
import {CompteElement} from '@sycadApp/models/data-references/contribuables/compte.model';

@Component({
  selector: 'app-form-acteur-valider-compte',
  templateUrl: './form-acteur-valider-compte.component.html',
  styleUrls: ['./form-acteur-valider-compte.component.scss']
})
export class FormActeurValiderCompteComponent implements OnInit {

  @Input('compteContribuable')
  compteContribuable: CompteElement;

  private _onDestroy = new Subject<void>();
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  constructor(private mediaObserver: MediaObserver) {}

  ngOnInit(): void {
  }

}
