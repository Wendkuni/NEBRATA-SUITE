import {
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {ParcelleDelimitation} from '@sycadApp/models/bornage/parcelle-delimitation.model';
import {MediaChange, MediaObserver} from '@angular/flex-layout';

@Component({
  selector: 'app-parcelle-delimitation-form',
  templateUrl: './parcelle-delimitation-form.component.html',
  styleUrls: ['./parcelle-delimitation-form.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ParcelleDelimitationFormComponent), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class ParcelleDelimitationFormComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {

  @Input() touched: boolean;
  @Input('formGroup') parcelleDelimitationForm: FormGroup;
  pointLimitation = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  sensDelimitation = [
    'NORD', 'SUD', 'EST', 'OUEST'
  ];

  get gpsX() { return this.parcelleDelimitationForm.get('gpsX'); }
  get gpsY() { return this.parcelleDelimitationForm.get('gpsY'); }
  get point() { return this.parcelleDelimitationForm.get('point'); }
  get sens() { return this.parcelleDelimitationForm.get('sens'); }
  get gissement() { return this.parcelleDelimitationForm.get('gissement'); }
  get limitation() { return this.parcelleDelimitationForm.get('limitation'); }
  get distance() { return this.parcelleDelimitationForm.get('distance'); }

  private _onDestroy = new Subject<void>();

  onChange: any = (_: ParcelleDelimitation) => {};

  onTouch: any = () => {};

  private subscription = new Subscription();

  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  constructor(private fb: FormBuilder,
              private mediaObserver: MediaObserver) { }


  ngOnInit(): void {
    this.subscription.add(
      this.parcelleDelimitationForm.valueChanges.subscribe((value: ParcelleDelimitation) => {
        this.onChange(value);
      })
    );
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['touched'] && simpleChanges['touched'].currentValue) {
      this.parcelleDelimitationForm.markAllAsTouched();
    }
  }

  writeValue(value: null | ParcelleDelimitation): void {
    if (value) {
      this.parcelleDelimitationForm.reset(value);
    }
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: ParcelleDelimitation) => {}): void {
    this.onTouch = fn;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this.subscription.unsubscribe();
  }

}
