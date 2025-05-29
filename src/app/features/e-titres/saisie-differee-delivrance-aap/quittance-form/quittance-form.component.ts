import { Component, Input, IterableDiffers, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Mandat, Quittance } from '@sycadApp/models/workflow/common/general';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { DropzoneComponent, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { of, Subject } from 'rxjs';
import {DateAdapter} from '@angular/material/core';
import { SdDelivranceAapService } from '@sycadApp/services/workflow/sd-delivrance-aap.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import { DataStoreService } from '@sycadApp/services/data-references/system/data-store.service';



@Component({
  selector: 'app-quittance-form',
  templateUrl: './quittance-form.component.html',
  styleUrls: ['./quittance-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QuittanceFormComponent implements  OnInit {

  public readOnlyFields = false;
  private _onDestroy = new Subject<void>();
  @Input("formGroup") quittanceForm: FormGroup;
  maxDate: Date;
  
  public codeNatureImpot: string;


  public quittanceId:number;
  public isLoading = false


  get id() { return this.quittanceForm.get('id'); }
  get reference() { return this.quittanceForm.get('reference'); }
  get date() { return this.quittanceForm.get('date'); }
  get montant() { return this.quittanceForm.get('montant'); }




  @ViewChild(DropzoneComponent, { static: false })
  dropzoneComponentRef?: DropzoneComponent;

  //[disabled]="mandatId"

  public mandatRemoteAutocomplete = new RemoteAutocomplete<Mandat>();

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    resizeWidth :300,
    resizeHeight :300,
    thumbnailHeight: 300,
    thumbnailWidth: 300,
    acceptedFiles: 'image/*,application/pdf',
    errorReset: null,
    cancelReset: null
  };
  public documentPiece = '';
  public iterableDiffer;
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private mediaObserver: MediaObserver,
    private _adapter: DateAdapter<any>,
    private iterableDiffers: IterableDiffers,
    public _snackBar: MatSnackBar,
    public delivranceAapService: SdDelivranceAapService,
    public dataStoreService: DataStoreService,

    ) {
      this.iterableDiffer = iterableDiffers.find([]).create(null);
      this.maxDate = new Date();
    }



    public activeMediaQuery = '';

    ngAfterContentInit() {


      this.mediaObserver.media$.subscribe((change: MediaChange) => {
        this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      });

      setTimeout(() => {
        // if(this.withMandat && this.id.value>0) {
        //      this.disableElementForm();
        //    }
      });


    }
    ngOnInit(): void {
      this._adapter.setLocale("fr");
      this.getCodeNatureImpot();
    }

    getCodeNatureImpot(){
      this.dataStoreService.get(25).subscribe(data => {

        this.codeNatureImpot = data.valeur;
      },
      errorResponse => {
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      this.isLoading = false;
      })
    }
    onInputChange(event: Event): void {
      const input = event.target as HTMLInputElement;
      input.value = input.value.toUpperCase();
    }
    onBlurReference(){

      if(this.reference.value.toUpperCase().substring(0, 3) == "QIT"){
        
        this.readOnlyFields = true;
       
        this.date.setValue(null);
        this.montant.setValue(null);
       
        this.isLoading = true;
        this.delivranceAapService.getQuittances(this.reference.value, this.codeNatureImpot).subscribe(data => {
          
          this.openSnackBar("Une quittance a été trouvé","OK");
          
          this.quittanceForm.patchValue({
            date: data.date,
            montant: data.montant,
          }),

          this.isLoading = false;
        },
        errorResponse => {
          SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
         this.isLoading = false;
        }
      );
  
      }else{
        this.readOnlyFields = false;
      }
    }
  
    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {
        duration: 25000,
        verticalPosition: "top",
      });
    }
  
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  public onSearchMandat(eventNgSelect){
    this.mandatRemoteAutocomplete.term.next(eventNgSelect.term);


  }
  public onChangeMandat(quittance: Quittance){
   if(quittance){
     this.quittanceForm.patchValue({
      reference:quittance.reference,
      date:quittance.date,
      montant:quittance.montant
     });
   }
  }


  private getCorrectWidth() {

    if(this.mediaObserver.isActive("xs")) {
      return {
        width: '95vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("sm")) {
      return {
        width: '80vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("md")) {
      return {
        width: '60vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }

    if(this.mediaObserver.isActive("lg")) {
      return {
        width: '55vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }
    if(this.mediaObserver.isActive("xl")) {
      return {
        width: '50vw',
        height: '90vh',
        position: {
          top:'2vh',
        }
      };
    }
  }
}
