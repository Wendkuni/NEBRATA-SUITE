import { Component, OnInit, ViewChild, OnDestroy, OnChanges,forwardRef, SimpleChanges, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, ControlValueAccessor,NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { GlobalPattern } from '@sycadApp/shared/validators/global-pattern';

export interface EmailFormValue {
  id: number;
  email: string;
  level: string;
  principal: boolean;
}


@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => EmailFormComponent), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class EmailFormComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges  {

  @Input() touched: boolean;
  private _onDestroy = new Subject<void>();
  @Input("formGroup") emailForm: FormGroup;


  
  onChange: any = (_: EmailFormValue) => {};
  onTouch: any = () => {};
 
  private subscription = new Subscription();

  get principal() {return this.emailForm.get("principal");}
  get level() { return this.emailForm.get("level");}
  get email() {return this.emailForm.get("email");}

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
      this.emailForm.valueChanges.subscribe((value: EmailFormValue) => {
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
      this.emailForm.markAllAsTouched();
    }
  }
  
  writeValue(value: null | EmailFormValue): void {
    if (value) {
      this.emailForm.reset(value);
    }
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: EmailFormValue) => {}): void {
    this.onTouch = fn;
  }

  @Output()
  public changeEmailPrincipal: EventEmitter<EmailFormValue> = new EventEmitter<EmailFormValue>();

  public onChangeTelephonePrincipal(mail) {
    this.changeEmailPrincipal.emit(mail);
  }

}
