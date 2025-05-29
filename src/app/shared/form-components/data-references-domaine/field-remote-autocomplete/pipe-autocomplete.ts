import { Pipe, Injectable, PipeTransform } from '@angular/core';
import get from 'lodash/get';
import { GenericAction, TypeColonne} from '@sycadApp/libs/model-table';
import { RemoteAutocompleteTableColonne } from './model-advanced-remote-autocomplete';
@Pipe({
  name: 'transFormDisplayedColumns'
})
@Injectable()
export class TransFormDisplayedColumnsAutocompletePipe implements PipeTransform {
  transform(items: RemoteAutocompleteTableColonne[], actions: GenericAction[]): string[] {
    if (!items) return [];
    let result = [];
    result.push("select");
    items.filter(el => el.show).forEach(it => result.push(it.name));
    return result;
  }
}


@Pipe({
  name: 'transListColumnFilte'
})
@Injectable()
export class TransListColumnFilterAutocompletePipe implements PipeTransform {
  transform(items: RemoteAutocompleteTableColonne[], actions: GenericAction[]): string[] {
    if (!items) return [];
    let result = [];
    return result;
  }
}


@Pipe({
  name: 'filterColonne'
})
@Injectable()
export class FilterColonneAutocompletePipe implements PipeTransform {
  transform(items: RemoteAutocompleteTableColonne[]): any[] {
    if (!items) return [];
    let result = items.filter(it => (it.type !== TypeColonne.ACTION && it.show));
    return result;
  }
}


@Pipe({
  name: 'ShowColonneValue'
})
@Injectable()
export class ShowColonneValueAutocompletePipe implements PipeTransform {
  transform(colonne: any,key:string): string {
    //console.log(colonne, key)
    return get(colonne, key);

  }
}


@Pipe({
  name: 'showBooleanValue'
})
export class ShowBooleanValueFilterAutocompletePipe implements PipeTransform {
  transform(value: boolean): any {
    return (value===true)?"OUI":"NON";
  }
}
