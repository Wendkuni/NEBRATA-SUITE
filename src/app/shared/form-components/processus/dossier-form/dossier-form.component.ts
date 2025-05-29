import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import {Subject} from 'rxjs';
import {
  MediaObserver,
  MediaChange
} from '@angular/flex-layout';

@Component({
  selector: 'app-dossier-form',
  templateUrl: './dossier-form.component.html',
  styleUrls: ['./dossier-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DossierFormComponent implements OnInit {


  private _onDestroy = new Subject<void>();
  @Input("formGroup") dossierForm: FormGroup;
  maxDate: Date;
  @Input() labelDateExterne: string = 'Date externe'; // Libellé par défaut
  @Input() labelReference: string = 'Référence externe';

  get objet() {
    return this.dossierForm.get('objet');
  }

  get dateExterne() {
    return this.dossierForm.get('dateExterne');
  }

  get refExterne() {
    return this.dossierForm.get('refExterne');
  }

  get observation() {
    return this.dossierForm.get('observation');
  }


  constructor(
    private fb: FormBuilder,
    private mediaObserver: MediaObserver
  ) {
    this.maxDate = new Date(); // Date actuelle
  }

  public activeMediaQuery = '';

  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }


  ngOnInit(): void {
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


}
