import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdresseContribuable, GeneralContribuable } from '@sycadApp/models/data-references/contribuables/global.model';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { Subject, of } from 'rxjs';
import { takeUntil, debounceTime, switchMap, catchError, map } from 'rxjs/operators';
import { IFUApiService } from './api-ifu.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfirmService } from '@sycadApp/shared/app-confirm/app-confirm.service';
import { ContactContribuableService } from '@sycadApp/services/data-references/system/contact.service';
import { Contact } from '@sycadApp/models/data-references/system/model';
import { AdresseMinimumExist, GlobalPattern } from '@sycadApp/shared/validators/global-pattern';
import { AttributsExist } from '@sycadApp/shared/validators/remote/attributs-exist';


export class RechercheContribuableIFU {
      typeContribuable:string;
      typeIdentifiant:string;
      contribuable:GeneralContribuable;
      message:string;
      success:boolean;
}

@Component({
  selector: 'app-recherche-ifu',
  templateUrl: './recherche-ifu.component.html',
  styleUrls: ['./recherche-ifu.component.scss']
})
export class RechercheSintaxComponent implements OnInit {

  public toggleRechercheSintax:boolean=false;

  @Input("urlRedirect")
  public urlRedirect:string;

  @Input("typeContribuable")
  public typeContribuable:string;

  @Output("trouveContribuable")
  public trouveContribuable: EventEmitter<RechercheContribuableIFU> = new EventEmitter<RechercheContribuableIFU>();

  @Output("importContribuable")
  public importContribuable: EventEmitter<GeneralContribuable> = new EventEmitter<GeneralContribuable>();

  @Input("updateContribuable")
  public updateContribuable: GeneralContribuable = null;

  @Input("isExpended")
  public isExpended: boolean = true;

  public searchTermSubject: Subject<string> = new Subject<string>();

  public rechercheContribuableIFU:RechercheContribuableIFU;

  public formulaire: FormGroup;

  get adresses() { return this.formulaire.get("adresses") as FormArray ;}
  get emails() { return this.formulaire.get("emails") as FormArray;}
  get telephones() { return this.formulaire.get("telephones") as FormArray;}

  public isLoadingResults = false;
  private _onDestroy = new Subject<void>();
  constructor(public sintaxApiService:IFUApiService,  
  private router: Router,
  public fb: FormBuilder,
  public confirmService:AppConfirmService,
  public contactContribuableService: ContactContribuableService,
  private _snackBar: MatSnackBar) {
      this.formulaire = this.fb.group({
        guid: null,
        adresses: new FormArray([]),
        emails: new FormArray([]),
        telephones: new FormArray([])

      });
  }


  // Pour les contribuables physiques comme moraux, on peut rechercher par IFU
  typeIdentifiantPiece = [
    { value: "NUMERO_IFU", label: 'NUMERO IFU' },
    { value: "RCCM", label: 'RCCM' },
    { value: "CNSS", label: 'CNSS' }
  ];


  identifiantPiece = null;
  searchTerm = null;

  ngOnInit(): void {
    // La recherche par nip est cependant réservée uniquement aux contribuables physiques.
    // C'est aussi le terme de recherche préféré.
    if(this.typeContribuable == 'CONTRIBUABLEPHYSIQUE'){
      this.typeIdentifiantPiece.unshift({ value: "NUMERO_NIP", label: 'NUMERO NIP' });
    }
    this.identifiantPiece = this.typeIdentifiantPiece[0];

    this.searchTermSubject.pipe(
      takeUntil(this._onDestroy),
      debounceTime(750),
      switchMap((search) => {

        this.isLoadingResults=true;
        return this.sintaxApiService.checkIfContribuableExist(search,this.identifiantPiece.value, this.typeContribuable).pipe(
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
     this.rechercheContribuableIFU = new RechercheContribuableIFU();
     this.rechercheContribuableIFU.typeContribuable=this.typeContribuable;
     this.rechercheContribuableIFU.typeIdentifiant=this.identifiantPiece.value;
      if(reponse.status == 200) {
        this.formulaire.reset();
        this.rechercheContribuableIFU.success=true;
        this.rechercheContribuableIFU.contribuable=reponse.body;

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

      }else {
        let httpErrorResponse  : HttpErrorResponse  = reponse;
         let error = httpErrorResponse ?.error;
         if(error && error.message){
          this.rechercheContribuableIFU.message=error.message;
         }else {
          this.rechercheContribuableIFU.message="Une erreur inattendue est survenue. Merci de réessayer plus tard";
         }

         this.rechercheContribuableIFU.success=false;
      }

      this.trouveContribuable.emit( this.rechercheContribuableIFU);
    });
  }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes.updateContribuable) {
        this.updateContribuable = changes.updateContribuable.currentValue;
        if(this.updateContribuable != null){
          this.searchTerm = this.updateContribuable.codeUnique;
          this.identifiantPiece = { value: "NUMERO_IFU", label: 'NUMERO IFU' };

          this.rechercheContribuableIFU = new RechercheContribuableIFU();
          this.rechercheContribuableIFU.typeContribuable=this.typeContribuable;
          this.rechercheContribuableIFU.typeIdentifiant=this.identifiantPiece.value;
          this.rechercheContribuableIFU.contribuable = this.updateContribuable;
          this.rechercheContribuableIFU.success = true;

          if (this.updateContribuable.telephones) {
            this.updateContribuable.telephones.map((telephone) => {
              this.telephones.insert(0, this.createTelephone(telephone));
            });
          }
  
          if (this.updateContribuable.emails) {
            this.updateContribuable.emails.map((mail) => {
              this.emails.insert(0, this.createEmail(mail));
            });
          }
  
          if (this.updateContribuable.adresses) {
            this.updateContribuable.adresses.map((adresse) => {
              this.adresses.insert(0, this.createAdresse(adresse));
            });
          }
        }
      }
    }

    updateContribuableIFU() {
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
         this.sintaxApiService.updateContribuable(this.updateContribuable.guid, this.rechercheContribuableIFU.contribuable.codeUnique,this.rechercheContribuableIFU.typeIdentifiant,this.typeContribuable, donneesComplementaires).subscribe((response: HttpResponse<GeneralContribuable>) => {
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
            this.contactContribuableService.deleteTelephone(this.rechercheContribuableIFU.contribuable.guid,telephone.value.id).subscribe(
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
          ville: [adresse.ville],
          pays: [adresse.pays]
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
          ville: [null],
          pays: [null]
        },{
          validator: AdresseMinimumExist()
        });
      }
    }
    addNewAdresse(){
      this.adresses.insert(0, this.createAdresse(null));
  
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
            this.contactContribuableService.deleteAdresse(this.rechercheContribuableIFU.contribuable.guid,adresse.value.id).subscribe(
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
          this.contactContribuableService.deleteEmail(this.rechercheContribuableIFU.contribuable.guid,email.value.id).subscribe(
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

  rechercherContribuable() {
    this.searchTermSubject.next(this.searchTerm);
  }

  importerContribuableIFU() {
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
    if(this.rechercheContribuableIFU.success){
      this.isLoadingResults=true;

      this.sintaxApiService.importerContribuable(this.rechercheContribuableIFU.contribuable.codeUnique,this.rechercheContribuableIFU.typeIdentifiant,this.typeContribuable, this.formulaire.value).subscribe((contribuable: GeneralContribuable) => {
        this.isLoadingResults=false;

        if(this.urlRedirect) {
          this.router.navigate([this.urlRedirect, contribuable.guid]);
        }else {
          this.importContribuable.emit(contribuable);
        }

      },
      errorResponse => {
        this.isLoadingResults=false;
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );
    }
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
