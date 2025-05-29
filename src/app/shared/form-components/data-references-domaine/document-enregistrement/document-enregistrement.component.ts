import { Component, forwardRef, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { MediaChange, MediaObserver } from "@angular/flex-layout";
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from "@angular/forms";

@Component({
  selector: 'document-enregistrement-form',
  templateUrl: './document-enregistrement.component.html',
  styleUrls: ['./document-enregistrement.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DocumentEnregistrementForm), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentEnregistrementForm implements OnInit {

  public formulaire: FormGroup;

  get dateEnregistrement() {return this.formulaire.get("dateEnregistrement");}
  get bordereau() {return this.formulaire.get("bordereau");}
  get volume() {return this.formulaire.get("volume");}
  get folio() {return this.formulaire.get("folio");}
  get caseDocumentEnregistrement() {return this.formulaire.get("caseDocumentEnregistrement");}
  get numeroQuittance() {return this.formulaire.get("numeroQuittance");}
  get dateQuittance() {return this.formulaire.get("dateQuittance");}
  get montantQuittance() {return this.formulaire.get("montantQuittance");}

  @Input()
  private documentEnregistrement = null;

  constructor(
    private mediaObserver: MediaObserver,
    public fb: FormBuilder
  ) {
    this.formulaire = this.fb.group({
        dateEnregistrement: [null, Validators.compose([Validators.required])],
        bordereau: [null, Validators.compose([Validators.required])],
        volume: [null],
        folio: [null],
        caseDocumentEnregistrement: [null],
        numeroQuittance: [null],
        dateQuittance: [null],
        montantQuittance: [0]
    });
  }

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  ngOnInit(): void {
    if(this.documentEnregistrement){

    } else {
        this.formulaire.patchValue({
            montantQuittance: 0
        });
    }
  }
}
