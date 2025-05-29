import { Component, OnInit, ViewChild, OnDestroy, OnChanges,forwardRef, SimpleChanges, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, ControlValueAccessor,NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { GlobalPattern } from '@sycadApp/shared/validators/global-pattern';




export interface TelephoneFormValue {
  id: number;
  numero: string;
  level: string;
  principal: boolean;
}

@Component({
  selector: 'app-telephone-form',
  templateUrl: './telephone-form.component.html',
  styleUrls: ['./telephone-form.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TelephoneFormComponent), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class TelephoneFormComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {

  @Input() touched: boolean;
  private _onDestroy = new Subject<void>();
  @Input("formGroup") telephone: FormGroup;
  public maskTelephone = ['0', '0', '2', '2', '6', ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/];

  onChange: any = (_: TelephoneFormValue) => {};
  onTouch: any = () => {};
 
  private subscription = new Subscription();

  get principal() {return this.telephone.get("principal");}
  get level() { return this.telephone.get("level");}
  get numero() {return this.telephone.get("numero");}

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
      this.telephone.valueChanges.subscribe((value: TelephoneFormValue) => {
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
      this.telephone.markAllAsTouched();
    }
  }
  
  writeValue(value: null | TelephoneFormValue): void {
    if (value) {
      this.telephone.reset(value);
    }
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: TelephoneFormValue) => {}): void {
    this.onTouch = fn;
  }

  @Output()
  public changeTelephonePrincipal: EventEmitter<TelephoneFormValue> = new EventEmitter<TelephoneFormValue>();

  public onChangeTelephonePrincipal(telephone) {
    this.changeTelephonePrincipal.emit(telephone);
  }
  
}
