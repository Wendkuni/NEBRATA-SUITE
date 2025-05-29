import { Validators, AbstractControl, FormGroup, FormControl, FormArray } from '@angular/forms';

export class GlobalPattern {
    public static patternTelephoneBf=Validators.pattern("^(\\(00226\\))( )[0-9]{2}( )[0-9]{2}( )[0-9]{2}( )[0-9]{2}$|^(\\(00226\\))[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}$|^(00226)[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}$|^(\\+226)[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}$|^(00226)( )[0-9]{2}( )[0-9]{2}( )[0-9]{2}( )[0-9]{2}$");
    public static UppperCaseWithUnderscore=Validators.pattern("[A-Z_1-9]{4,50}");
    public static numeroParcelle=Validators.pattern("[0-9]{4}");
}

export function getErrors(formGroup: FormGroup|FormArray, errors: any = []) {

    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        if(control.errors) {
      // // console.log("error 1",control.errors)
          errors.push(field);
        }

      } else if ((control instanceof FormGroup) || (control instanceof FormArray)) {
        let error = getErrors(control);

        if(error && error.length>0){
      // // console.log("error 2",error)
          errors.push(field);
        }
      }
    });

  return errors;
}

/*

export function getErrors(formGroup: FormGroup, errors: any = {}) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      if(control.errors) {
        errors[field] = control.errors;
      }

    } else if (control instanceof FormGroup) {
      let error = getErrors(control);
      if(error){
        errors[field] = error;
      }
    }
  });
  return errors;
}

*/
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
}
export function AffecationMinimumExist() {
  return (formGroup: FormGroup) => {
    const bureau = formGroup.controls["bureau"];
    const service = formGroup.controls["service"];
    const structure = formGroup.controls["structure"];

    if (!bureau.value &&  !service.value &&  !structure.value) {
      bureau.setErrors({ minimumAffectationExist: true });
    } else {
      bureau.setErrors(null);
    }
}
}
export function AdresseMinimumExist() {
  return (formGroup: FormGroup) => {
      const libelle = formGroup.controls["libelle"];
      const localite = formGroup.controls["localite"];
      if ((libelle.errors || localite.errors) && (localite.errors && !localite.errors.minimumExist)) {
          return;
      }

      if (!libelle.value &&  !localite.value) {
        libelle.setErrors({ minimumExist: true });
      } else {
        libelle.setErrors(null);
      }
  }
}
/*
function telephoneFormatValidator(control: AbstractControl): { [key: string]: boolean } | null {
  if(control.value) {
    let patternPhone="";
    let tab = control.value.split(" ");
    if (tab && tab.length>1) {
      return { 'telephoneFormat': true };
    }
  }

  return null;
}
*/
/*
function attributUppperCaseWithUnderscoreValidator(control: AbstractControl): { [key: string]: boolean } | null {
  if(control.value) {
    let patternPhone="";
    let tab = control.value.split(" ");
    if (tab && tab.length>1) {
      return { 'telephoneFormat': true };
    }
  }

  return null;
}

*/
