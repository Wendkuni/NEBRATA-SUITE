import { Component, OnInit, ViewChild, OnDestroy, OnChanges,forwardRef, SimpleChanges, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, ControlValueAccessor,NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { GlobalPattern } from '@sycadApp/shared/validators/global-pattern';

export interface ReseauSociauxFormValue {
  id: number;
  profil: string;
  type: string;
}
 
@Component({
  selector: 'app-reseau-sociaux-form',
  templateUrl: './reseau-sociaux-form.component.html',
  styleUrls: ['./reseau-sociaux-form.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ReseauSociauxFormComponent), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class ReseauSociauxFormComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges  {

  @Input() touched: boolean;
  private _onDestroy = new Subject<void>();
  @Input("formGroup") reseauSociauxForm: FormGroup;


  
  onChange: any = (_: ReseauSociauxFormValue) => {};
  onTouch: any = () => {};
 
  private subscription = new Subscription();

  get profil() {return this.reseauSociauxForm.get("profil");}
  get type() { return this.reseauSociauxForm.get("type");}

  constructor(
    private fb: FormBuilder,
    private mediaObserver: MediaObserver
    ) {}


    public activeMediaQuery = '';
    ngAfterContentInit() {
      this.mediaObserver.media$.subscribe((change: MediaChange) => {
        this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
      });
    }
  ngOnInit(): void {
    this.subscription.add(
      this.reseauSociauxForm.valueChanges.subscribe((value: ReseauSociauxFormValue) => {
        this.onChange(value);
      })
    );
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this.subscription.unsubscribe();
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['touched'] && simpleChanges['touched'].currentValue) {
      this.reseauSociauxForm.markAllAsTouched();
    }
  }
  
  writeValue(value: null | ReseauSociauxFormValue): void {
    if (value) {
      this.reseauSociauxForm.reset(value);
    }
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: ReseauSociauxFormValue) => {}): void {
    this.onTouch = fn;
  }

 
 

}
