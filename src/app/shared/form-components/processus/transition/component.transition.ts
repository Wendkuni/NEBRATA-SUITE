import { Component, OnInit, Input, Output, EventEmitter, Directive, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { getErrors } from '@sycadApp/shared/validators/global-pattern';
import { Subject } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';


@Directive()
export class TransitionComponent {

  constructor( 
    public mediaObserver: MediaObserver){
  }
  
  public  formulaire: FormGroup;
  
  public _onDestroy = new Subject<void>();
    

  @Output()
  public loadingEvent:  EventEmitter<Boolean> = new EventEmitter<Boolean>();



    public activeMediaQuery = '';

    @Output()
    public formErrors:  EventEmitter<String[]> = new EventEmitter<String[]>();
   
    ngAfterContentInit() {


      this.formulaire.valueChanges.pipe(
        takeUntil(this._onDestroy)
      ).subscribe(() => {
       let dataError=getErrors(this.formulaire);
       // this.onDetectError.emit(dataError)
      //// console.log("dataError", dataError)
       setTimeout(() => {
        //console.log("emit dataError", dataError)
        this.formErrors.emit(dataError);
      });
      
       
      });
    }
  
    ngOnDestroy() {
      this._onDestroy.next();
      this._onDestroy.complete();
    }
  
}