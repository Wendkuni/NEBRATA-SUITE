import { AsyncValidatorFn } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, map, first } from 'rxjs/operators';
import { merge, of } from 'rxjs';


export class AttributsExist {

  public static validateUsernameExistFn(apiService: {
    searchUsername(guid: string, username: string);
  }): AsyncValidatorFn {

    return (control  ) => {
      if (!control.valueChanges || control.pristine) {
        return of(null);
      }
      else {
        return control.valueChanges
          .pipe(
            debounceTime(750),
            distinctUntilChanged(),
            switchMap(username => {
              let guid = control.parent.get("guid").value;
              return apiService.searchUsername(guid, username)
            }),
            map(res => {
              return (res==false) ? { usernameExist: true } : null;
            }),
            first());
      }

    }
  }


  public static validateNumeroPieceExistFn(apiService: {
    searchNumeroPiece(guid: string, numero: string, categorie:number);
  }, interne:boolean=false): AsyncValidatorFn {

    return (control  ) => {
      if (!control.valueChanges || control.pristine) {
        return of(null);
      }
      else {
        return merge(control.valueChanges,control.parent.get("categorie").valueChanges)
          .pipe(
            debounceTime(750),
            distinctUntilChanged(),
            switchMap(numero => {
              let formGroupUser=null;

              if(interne) {
                let formGroupPiece=control.parent;
                formGroupUser=formGroupPiece.parent;
              }else {
                let formGroupPiece=control.parent;
                let formGroupArrayPiece=formGroupPiece.parent;
                 formGroupUser=formGroupArrayPiece.parent;
              }

              let guid = formGroupUser.get("guid").value;
               let categorie=  control.parent.get("categorie").value;
              return apiService.searchNumeroPiece(guid, numero,categorie)
            }),
            map(res => {
              return (res==false) ? { numeroPieceExist: true } : null;
            }),
            first());
      }

    }
  }

  public static validateNipPieceExistFn(apiService: {
    searchNipPiece(guid: string, numero: string, categorie:number);
  }, interne:boolean=false): AsyncValidatorFn {

    return (control  ) => {
      if (!control.valueChanges || control.pristine) {
        return of(null);
      }
      else {


        return merge(control.valueChanges,control.parent.get("categorie").valueChanges)
          .pipe(
            debounceTime(750),
            distinctUntilChanged(),
            switchMap(numero => {
              let formGroupUser=null;

              if(interne) {
                let formGroupPiece=control.parent;
                formGroupUser=formGroupPiece.parent;
              }else {
                let formGroupPiece=control.parent;
                let formGroupArrayPiece=formGroupPiece.parent;
                 formGroupUser=formGroupArrayPiece.parent;
              }
              let guid = formGroupUser.get("guid").value;
              let categorie=  control.parent.get("categorie").value;
              return apiService.searchNipPiece(guid, numero,categorie)
            }),
            map(res => {
              return (res==false) ? { nipExist: true } : null;
            }),
            first());
      }

    }
  }

  public static validateNumeroCnssExistFn(apiService: {
    searchNumeroCnss(guid: string, numero: string);
  }): AsyncValidatorFn {

    return (control  ) => {
      if (!control.valueChanges || control.pristine) {
        return of(null);
      }
      else {
        return control.valueChanges
          .pipe(
            debounceTime(750),
            distinctUntilChanged(),
            switchMap(numero => {
              let guid = control.parent.get("guid").value;
              return apiService.searchNumeroCnss(guid, numero)
            }),
            map(res => {
              return (res==false) ? { numCNSSExist: true } : null;
            }),
            first());
      }

    }
  }

  public static validateEmailExistFn(apiService: {
    searchEmail(guid: string, email: string);
  }): AsyncValidatorFn {

    return (control  ) => {
      if (!control.valueChanges || control.pristine) {
        return of(null);
      }
      else {
        return control.valueChanges
          .pipe(
            debounceTime(750),
            distinctUntilChanged(),
            switchMap(email => {
              let formGroupTelephone=control.parent;
              let formGroupArrayTelephone=formGroupTelephone.parent;
              let formGroupUser=formGroupArrayTelephone.parent;
              let guid = formGroupUser.get("guid").value;
              return apiService.searchEmail(guid, email)
            }),
            map(res => {
              return (res==false) ? { emailExist: true } : null;
            }),
            first());
      }

    }
  }

  public static validateTelephoneExistFn(apiService: {
    searchTelephone(guid: string, numero: string);
  }): AsyncValidatorFn {

    return (control  ) => {
      if (!control.valueChanges || control.pristine) {
        return of(null);
      }
      else {
        return control.valueChanges
          .pipe(
            debounceTime(750),
            distinctUntilChanged(),
            switchMap(numero => {
              let formGroupTelephone=control.parent;
              let formGroupArrayTelephone=formGroupTelephone.parent;
              let formGroupUser=formGroupArrayTelephone.parent;
              let guid = formGroupUser.get("guid").value;
              return apiService.searchTelephone(guid, numero)
            }),
            map(res => {
              return (res==false) ? { telephoneExist: true } : null;
            }),
            first());
      }
    }
  }


  public static validateTelephoneExistPublicFn(apiService: {
    searchTelephone( numero: string);
  }): AsyncValidatorFn {

    return (control  ) => {
      if (!control.valueChanges || control.pristine) {
        return of(null);
      }
      else {
        return control.valueChanges
          .pipe(
            debounceTime(750),
            distinctUntilChanged(),
            switchMap(numero => {
              return apiService.searchTelephone(numero)
            }),
            map(res => {
              return (res==false) ? { telephoneExist: true } : null;
            }),
            first());
      }
    }
  }

  public static validateEmailExistPublicFn(apiService: {
    searchEmail( email: string);
  }): AsyncValidatorFn {

    return (control  ) => {
      if (!control.valueChanges || control.pristine) {
        return of(null);
      }
      else {
        return control.valueChanges
          .pipe(
            debounceTime(750),
            distinctUntilChanged(),
            switchMap(email => {
              return apiService.searchEmail(email)
            }),
            map(res => {
              return (res==false) ? { emailExist: true } : null;
            }),
            first());
      }

    }
  }

}

