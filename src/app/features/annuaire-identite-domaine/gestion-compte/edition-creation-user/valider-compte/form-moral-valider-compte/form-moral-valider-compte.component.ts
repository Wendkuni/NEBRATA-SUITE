import {Component, Input, OnInit} from '@angular/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {Subject, of} from 'rxjs';
import {CompteElement} from '@sycadApp/models/data-references/contribuables/compte.model';

@Component({
  selector: 'app-form-moral-valider-compte',
  templateUrl: './form-moral-valider-compte.component.html',
  styleUrls: ['./form-moral-valider-compte.component.scss']
})
export class FormMoralValiderCompteComponent implements OnInit {

  @Input('compteContribuable')
  compteContribuable: CompteElement;
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  constructor(private mediaObserver: MediaObserver) {}

  ngOnInit(): void {}

}
