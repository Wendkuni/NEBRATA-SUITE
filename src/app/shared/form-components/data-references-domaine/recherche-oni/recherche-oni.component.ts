import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdresseContribuable, GeneralContribuable, PieceOfficielle, SituationMatrimonialeAutocomplete } from '@sycadApp/models/data-references/contribuables/global.model';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { Subject, of } from 'rxjs';
import { takeUntil, debounceTime, switchMap, catchError, map } from 'rxjs/operators';
import { ONIApiService } from './api-oni.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdresseMinimumExist, GlobalPattern } from '@sycadApp/shared/validators/global-pattern';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';
import { Contact } from '@sycadApp/models/data-references/system/model';
import { AttributsExist } from '@sycadApp/shared/validators/remote/attributs-exist';
import { RemoteAutocomplete } from '../../model/remote-autocomplete';
import { SituationMatrimonialeService } from '@sycadApp/services/data-references/system/situationMatrimoniale.service';


export class RechercheContribuableONI {
      typeContribuable:string;
      typeIdentifiant:string;
      contribuable:GeneralContribuable;
      message:string;
      success:boolean;
}

@Component({
  selector: 'app-recherche-oni',
  templateUrl: './recherche-oni.component.html',
  styleUrls: ['./recherche-oni.component.scss']
})
export class RechercheOniComponent implements OnInit {

  public toggleRechercheSintax:boolean=false;

  @Input("formGroup")
  public formulaire: FormGroup;

  @Input("urlRedirect")
  public urlRedirect:string;

  @Input("typeContribuable")
  public typeContribuable:string;

  @Input("typePiece")
  public typePiece:string

  @Input("updateContribuable")
  public updateContribuable: GeneralContribuable = null;

  @Input("isExpended")
  public isExpended: boolean = true;

  @Output("trouveContribuable")
  public trouveContribuable: EventEmitter<RechercheContribuableONI> = new EventEmitter<RechercheContribuableONI>();

  @Output("importContribuable")
  public importContribuable: EventEmitter<GeneralContribuable> = new EventEmitter<GeneralContribuable>();

  public searchTermSubject: Subject<string> = new Subject<string>();

  public rechercheContribuableONI:RechercheContribuableONI;
  public situationMatrimonialeAutocomplete = new RemoteAutocomplete<SituationMatrimonialeAutocomplete>();

  public isLoadingResults = false;
  private _onDestroy = new Subject<void>();
  public contribuableFound: GeneralContribuable;

  get nom() { return this.formulaire.get('nom'); }
  get numeroPiece() { return this.formulaire.get('numeroPiece'); }

  get prenoms() { return this.formulaire.get('prenoms'); }
  get nomJeuneFille() { return this.formulaire.get('nomJeuneFille'); }
  get dateNaissance() { return this.formulaire.get('dateNaissance'); }
  get lieuNaissance() { return this.formulaire.get('lieuNaissance'); }
  get nomPere() { return this.formulaire.get('nomPere'); }
  get nomMere() { return this.formulaire.get('nomMere'); }
  get profession() { return this.formulaire.get('profession'); }
  get situationMatrimoniale() { return this.formulaire.get('situationMatrimoniale'); }

  get adresses() { return this.formulaire.controls.adresses as FormArray ;}
  get emails() { return this.formulaire.get("emails") as FormArray;}
  get telephones() { return this.formulaire.get("telephones") as FormArray;}

  constructor(public oniApiService: ONIApiService,
    public situationMatrimonialeService: SituationMatrimonialeService,
    public confirmService:AppConfirmService,
    public contactContribuableService: ContactContribuableService,
    public fb: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar) {
    this.formulaire = this.fb.group({
      guid: null,
      nom: [null, Validators.compose([Validators.required])],
      prenoms: [null],
      nomJeuneFille: [null],
      dateNaissance: [null],
      lieuNaissance: [null],
      nomPere: [null],
      nomMere: [null],
      profession: [null],
      genre: [null],
      numeroPiece: [null],

      situationMatrimoniale: [null, Validators.compose([Validators.required])],
      adresses: new FormArray([]),
      emails: new FormArray([]),
      telephones: new FormArray([]),
    });
   }

  /**************** téléphone *********************/

  removeTelephones(index) {
    let telephone = this.telephones.at(index);
    if (telephone.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer ce  téléphone ? `
      }).subscribe(($choix)=> {

        if($choix) {
          this.isLoadingResults=true;
          this.contactContribuableService.deleteTelephone(this.contribuableFound.guid,telephone.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.telephones.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }

      });
    } else {
      this.telephones.removeAt(index);
    }
  }
  createTelephone(telephone:Contact) {
    if(telephone) {
      return this.fb.group({
        id: [telephone.id],
        principal: [telephone.principal],
        level: [telephone.level, Validators.compose([Validators.required])],
        numero: [telephone.value, Validators.compose([Validators.required, GlobalPattern.patternTelephoneBf])]
      });
    }else {
      return this.fb.group({
        id: [null],
        principal: [false],
        level: ["PROFESSIONAL", Validators.compose([Validators.required])],
        numero: [null, Validators.compose([Validators.required, GlobalPattern.patternTelephoneBf])]
      });
    }
  }
  addNewTelephone() {
    this.telephones.insert(0, this.createTelephone(null));
  }
public onChangeTelephonePrincipal(telephone) {
  this.telephones.controls.forEach(telCtl => {
    if(telCtl!==telephone) {
      telCtl.patchValue({
        principal: false
      });
    }
  });
}
  /**************** fin téléphone *********************/

  /**************** adresse *********************/
  createAdresse(adresse:AdresseContribuable) {
    if(adresse) {
      return this.fb.group({
        id: [adresse.id],
        libelle: [adresse.libelle],
        principal: [adresse.principal],
        localite: [adresse.localite],
        rue: [adresse.rue],
        porte: [adresse.porte],
        quartier: [adresse.quartier],
        ville: [adresse.ville, Validators.compose([Validators.required])],
        pays: [adresse.pays, Validators.compose([Validators.required])]
      },{
        validator: AdresseMinimumExist()
      });
    }else {
      return this.fb.group({
        id: [null],
        libelle: [null],
        principal: [false],
        localite: [null],
        rue: [null],
        porte: [null],
        quartier: [null],
        ville: [null, Validators.compose([Validators.required])],
        pays: [null, Validators.compose([Validators.required])]
      },{
        validator: AdresseMinimumExist()
      });
    }
  }
  addNewAdresse(){
    this.adresses.insert(0, this.createAdresse(null));

  }
  public onSearchSituationMatrimoniale(eventNgSelect) {
    this.situationMatrimonialeAutocomplete.term.next(eventNgSelect.term);
  }
  removeAdresse(index) {
    let adresse = this.adresses.at(index);
    if (adresse.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer cette adresse Email ? `
      }).subscribe(($choix)=> {
        if($choix) {
          this.isLoadingResults=true;
          this.contactContribuableService.deleteAdresse(this.contribuableFound.guid,adresse.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.adresses.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }

      });
    } else {
      this.adresses.removeAt(index);
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }

  public onChangeAdressePrincipal(adresse) {
    this.adresses.controls.forEach(adresseCtl => {
      if(adresseCtl!==adresse) {
        adresseCtl.patchValue({
          principal: false
        });
      }

    });
  }

searchTerm = null;

  ngOnInit(): void {

    this.situationMatrimonialeAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.situationMatrimonialeService);

    this.searchTermSubject.pipe(
      takeUntil(this._onDestroy),
      debounceTime(750),
      switchMap((search) => {
        this.isLoadingResults=true;
        return this.oniApiService.checkIfContribuableExist(this.nom.value, this.numeroPiece.value, this.typePiece).pipe(
          map(response => {

            this.isLoadingResults=false;
            return response;
          }),
          catchError((err) => {
            this.isLoadingResults = false;
            return of(err);
          })
        );
      }),
    ).subscribe((reponse) => {
     this.rechercheContribuableONI = new RechercheContribuableONI();
     this.rechercheContribuableONI.typeContribuable=this.typeContribuable;
     this.rechercheContribuableONI.typeIdentifiant='NUMERO_PIECE';
      if(reponse.status == 200) {
        this.formulaire.get('adresses').reset();
        this.formulaire.get('emails').reset();
        this.formulaire.get('telephones').reset();
        this.formulaire.get('situationMatrimoniale').reset();
        this.rechercheContribuableONI.success=true;
        this.rechercheContribuableONI.contribuable=reponse.body;
        this.contribuableFound = this.rechercheContribuableONI.contribuable;

        // Initialisation des champs modifiables
        this.formulaire.get('prenoms').disable();
        this.formulaire.get('nomJeuneFille').disable();
        this.formulaire.get('dateNaissance').disable();
        this.formulaire.get('lieuNaissance').disable();
        this.formulaire.get('nomPere').disable();
        this.formulaire.get('nomMere').disable();
        this.formulaire.get('profession').disable();
        this.formulaire.get('genre').disable();

        this.formulaire.patchValue({
          nomJeuneFille: this.rechercheContribuableONI.contribuable.nomDeJeuneFille,
          prenoms: this.rechercheContribuableONI.contribuable.prenoms,
          genre: this.rechercheContribuableONI.contribuable.genre,
          profession: this.rechercheContribuableONI.contribuable.profession,
          dateNaissance: this.rechercheContribuableONI.contribuable.dateNaissance,
          lieuNaissance: this.rechercheContribuableONI.contribuable.lieuNaissance,
          nomPere: this.rechercheContribuableONI.contribuable.nomPere,
          nomMere: this.rechercheContribuableONI.contribuable.nomMere,
        });

        if (this.updateContribuable?.telephones) {
          this.updateContribuable.telephones.map((telephone) => {
            this.telephones.insert(0, this.createTelephone(telephone));
        });
        }

        if (this.updateContribuable?.emails) {
          this.updateContribuable.emails.map((mail) => {
            this.emails.insert(0, this.createEmail(mail));
        });
        }
        if (this.updateContribuable?.adresses) {
          this.updateContribuable.adresses.map((adresse) => {
            this.adresses.insert(0, this.createAdresse(adresse));
        });
        }

        if (this.updateContribuable?.situationMatrimoniale) {
          this.formulaire.patchValue({
            situationMatrimoniale: this.updateContribuable.situationMatrimoniale.id
          });
        }
      }else {
        let httpErrorResponse  : HttpErrorResponse  = reponse;
         let error = httpErrorResponse ?.error;
         if(error && error.message){
          this.rechercheContribuableONI.message=error.message;
         }else {
          this.rechercheContribuableONI.message="Une erreur inattendue est survenue. Merci de réessayer plus tard";
         }

         this.rechercheContribuableONI.success=false;
      }

      this.trouveContribuable.emit( this.rechercheContribuableONI);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.updateContribuable) {
      this.updateContribuable = changes.updateContribuable.currentValue;
      if(this.updateContribuable != null){
        this.formulaire.patchValue({
          numeroPiece: this.updateContribuable.pieceOfficielle?.numero,
          nom: this.updateContribuable.nom
        });
      }
    }
  }

  /**************** email *********************/
  createEmail(mail:Contact) {
    if(mail) {
      return this.fb.group({
        id: [mail.id],
        principal: [mail.principal],
        level: [mail.level, Validators.compose([Validators.required])],
        email: [mail.value, Validators.compose([Validators.required, Validators.email]),
        [AttributsExist.validateEmailExistFn(this.contactContribuableService)]]
      });
    }else {
      return this.fb.group({
        id: [null],
        principal: [false],
        level: ["PROFESSIONAL", Validators.compose([Validators.required])],
        email: [null, Validators.compose([Validators.required, Validators.email]),
        [AttributsExist.validateEmailExistFn(this.contactContribuableService)]]
      });
    }
  }

  addNewEmail() {
    this.emails.insert(0, this.fb.group({
      id: [null],
      principal: [false],
      level: ["PROFESSIONAL", Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, Validators.email]),
      [AttributsExist.validateEmailExistFn(this.contactContribuableService)]]
    }));
  }

  removeEmails(index) {
    let email = this.emails.at(index);
    if (email.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer cette adresse Email ? `
      }).subscribe(($choix)=> {

        if($choix) {
          this.isLoadingResults=true;
          this.contactContribuableService.deleteEmail(this.contribuableFound.guid,email.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("Element supprimé avec succès", "OK");
              this.emails.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }

      });
    } else {
      this.emails.removeAt(index);
    }
  }

  public onChangeEmailPrincipal(email) {
    this.emails.controls.forEach(mailCtl => {
      if(mailCtl!==email) {
        mailCtl.patchValue({
          principal: false
        });
      }
    });
  }

  importerContribuableONI() {
    if (!this.formulaire.valid) {
      const findInvalidControls = () => {
        const invalid = [];
          const controls = this.formulaire.controls;
          for (const name in controls) {
              if (controls[name].invalid) {
                  invalid.push(name);
              }
          }
          return invalid;
      };
      const message = "Les champs suivants sont invalides : "+findInvalidControls().join(', ');
      this.openSnackBar(message, "OK");
      return false;
    }

    let donneesComplementaires = this.formulaire.value;

    if(this.rechercheContribuableONI.success){
       this.isLoadingResults=true;
       this.oniApiService.importContribuable(this.nom.value, this.numeroPiece.value, this.typePiece, this.typeContribuable, donneesComplementaires).subscribe((response: HttpResponse<GeneralContribuable>) => {
        this.isLoadingResults = false;
        if(response.status == 200){
          const contribuable: GeneralContribuable = response.body;
          if (this.urlRedirect) {
            this.router.navigate([this.urlRedirect, contribuable.guid]);
          } else {
            this.importContribuable.emit(contribuable);
          }
        }
      },
      errorResponse => {
         this.isLoadingResults=false;
         SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
     );
     }
   }

   updateContribuableONI() {
    if (!this.formulaire.valid) {
      const findInvalidControls = () => {
        const invalid = [];
          const controls = this.formulaire.controls;
          for (const name in controls) {
              if (controls[name].invalid) {
                  invalid.push(name);
              }
          }
          return invalid;
      };
      const message = "Les champs suivants sont invalides : "+findInvalidControls().join(', ');
      this.openSnackBar(message, "OK");
      return false;
    }
    if(this.updateContribuable != null){
      let donneesComplementaires = this.formulaire.value;

       this.isLoadingResults=true;
       this.oniApiService.updateContribuable(this.updateContribuable.guid, this.updateContribuable.codeUnique, this.nom.value, this.numeroPiece.value, this.typePiece,  this.typeContribuable, donneesComplementaires).subscribe((response: HttpResponse<GeneralContribuable>) => {
        this.isLoadingResults = false;
        if(response.status == 200){
          const contribuable: GeneralContribuable = response.body;
          if (this.urlRedirect) {
            this.router.navigate([this.urlRedirect, contribuable.guid]);
          } else {
            this.importContribuable.emit(contribuable);
          }
        }
      },
       errorResponse => {
         this.isLoadingResults=false;
         SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
       }
     );
     }
   }

  rechercherContribuable() {
    this.searchTermSubject.next(this.searchTerm);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
