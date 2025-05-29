import {TypeColonne} from "@sycadApp/libs/model-table";

export class RemoteAutocompleteTableColonne {
  name: string;
  label: string;
  show: boolean;
  filterValue: string | boolean;
  type: TypeColonne;
  constructor(name: string, label: string, type: TypeColonne, show: boolean, filterValue: string| boolean) {
    this.name = name;
    this.label = label;
    this.type = type;
    this.show = show;
    this.filterValue = filterValue;
  }
  }

export class RemoteAutocompleteTableMetaData {
  colonnes: RemoteAutocompleteTableColonne[] = Array<RemoteAutocompleteTableColonne>();
  title: string;
  globalFilter: string;

  constructor(title: string, globalFilter = '') {
    this.title = title;
    this.globalFilter = globalFilter;
  }

  public pushColumn(colonne: RemoteAutocompleteTableColonne): RemoteAutocompleteTableMetaData{
   this.colonnes.push(colonne);
   return this;
  }

}

