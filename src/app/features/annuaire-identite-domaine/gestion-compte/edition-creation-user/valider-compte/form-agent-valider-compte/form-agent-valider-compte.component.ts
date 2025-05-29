import {Component, Input, OnInit} from '@angular/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { Subject, of} from "rxjs";
import {CompteElement} from '@sycadApp/models/data-references/contribuables/compte.model';


@Component({
  selector: 'app-form-agent-valider-compte',
  templateUrl: './form-agent-valider-compte.component.html',
  styleUrls: ['./form-agent-valider-compte.component.scss']
})
export class FormAgentValiderCompteComponent implements OnInit {

  @Input('compteContribuable')
  compteContribuable: CompteElement;
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  constructor(private mediaObserver: MediaObserver) { }

  ngOnInit(): void {}

}
