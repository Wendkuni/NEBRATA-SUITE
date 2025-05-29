
export class Menu {
  id: number;
  ordre: number;
  titre: string;
  icon: Icon;
  hasSubMenu: boolean;
  parentId: number;
  routerLink: string;
}
export class Icon {
  id: number;
  cssClass: string;
}
