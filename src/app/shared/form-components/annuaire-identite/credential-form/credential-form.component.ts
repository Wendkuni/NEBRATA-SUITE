import { Component, OnInit,Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder,  FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';


@Component({
  selector: 'app-credential-form',
  templateUrl: './credential-form.component.html',
  styleUrls: ['./credential-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CredentialFormComponent implements  OnInit {

  private _onDestroy = new Subject<void>();
  @Input("formGroup") credentialForm: FormGroup;

  public passwordHide: boolean = true;
  public passwordHides: boolean = true;


  get username() {return this.credentialForm.get("username");}
  get password() { return this.credentialForm.get("password");}
  get passwordc() {return this.credentialForm.get("passwordc");}
  get active() {return this.credentialForm.get("active");}
  get resetOtp() {return this.credentialForm.get("resetOtp");}

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



  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }




}
