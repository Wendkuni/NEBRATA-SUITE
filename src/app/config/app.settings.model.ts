export class Settings {
                public name: string="Plateforme cloud - SYCAD";
                public loadingSpinner: boolean=false;
                public progressBar: boolean=false;
                public preference:Preference;
    constructor() { }
}

export class Preference {
                public langue: string;
                public theme: string;
                public rtl: boolean;
                public fixedHeader:boolean;
                public sidenavIsOpened: boolean;
                public sidenavIsPinned: boolean;
                public menu: string;
                public menuType: string;


}
