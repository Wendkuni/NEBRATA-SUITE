import { AuthentificatedUser } from '@sycadApp/features/login/auth.user';
import { ContactEntreprise } from '@sycadApp/models/data-references/contribuables/global.model';


export class ContribuableMoralUserInfo  extends AuthentificatedUser{
    dateDeCreation: Date;
    designation: string;
    statusJuridique: string;
    contactEntreprises: ContactEntreprise[]
}
