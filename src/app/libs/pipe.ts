import { Pipe, Injectable, PipeTransform } from '@angular/core';
import { SycadTableColonne, TypeColonne, GenericAction } from './model-table';
import get from 'lodash/get';

@Pipe({
    name: 'transFormDisplayedColumns'
})
@Injectable()
export class TransFormDisplayedColumnsPipe implements PipeTransform {
    transform(items: SycadTableColonne[],actions:GenericAction[],isOnlyListing:boolean=false): string[] {
        if (!items) return [];
        let result = [];

        if(actions.length>0) {
            result.push("select");
        }

        items.filter(el => el.show).forEach(it => result.push(it.name));

        if(!isOnlyListing) {
            result.push("action");
        }

        return result;
    }
}


@Pipe({
    name: 'transListColumnFilte'
})
@Injectable()
export class TransListColumnFilterPipe implements PipeTransform {
    transform(items: SycadTableColonne[],actions:GenericAction[],isOnlyListing:Boolean=false): string[] {
        if (!items) return [];
        let result = [];

        if(actions.length>0) {
            result.push("filter-select");
        }

        items.filter(el => el.show).forEach(it => result.push("filter-" + it.name));
        if(!isOnlyListing) {
            result.push("filter-action");
        }


        return result;
    }
}


@Pipe({
    name: 'filterColonne'
})
@Injectable()
export class FilterColonnePipe implements PipeTransform {
    transform(items: SycadTableColonne[]): any[] {
        if (!items) return [];
        let result = items.filter(it => (it.type !== TypeColonne.ACTION && it.show));
        return result;
    }
}


@Pipe({
    name: 'ShowColonneValue'
})
@Injectable()
export class ShowColonneValuePipe implements PipeTransform {
    transform(colonne: any,key:string, colonneMeta: SycadTableColonne): string {
        return get(colonne, key);

    }
}


@Pipe({
    name: 'showBooleanValue'
  })
  export class ShowBooleanValueFilterPipe implements PipeTransform {
    transform(value: any): any {

      return (value===true || value==="true")?"OUI":"NON";
    }
  }
