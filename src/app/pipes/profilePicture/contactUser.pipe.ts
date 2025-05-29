import { Pipe, PipeTransform } from '@angular/core';
import { Contact, TypeContact } from '@sycadApp/models/data-references/system/model';



function getPrincipal(list) {
  
  if(list) {
    let cpt=0;
    let max= list.length;
    while(cpt<max) {
      if(list[cpt].principal) {
        return list[cpt];
      }
      cpt++;
    }
  }


  return null;
}


@Pipe({name: 'principalContactFilter'})
export class PrincipalContactFilterPipe  implements PipeTransform{

    transform(contacts: Contact[]): string {

      if(contacts) {
        let contact = getPrincipal(contacts);
        if(contact) {
         return contact.value;
         }else if(contacts.length>0) {
           return contacts[0].value;
         }  
      }
   

        return "Aucune données";
    }

}


@Pipe({name: 'principalAdresseFilter'})
export class PrincipalAdresseFilterPipe  implements PipeTransform{

    transform(adresses: any[]): string {
  if(adresses) {
    let adresse = getPrincipal(adresses);
    if(adresse) {
      return adresse.libelle;
    }
  }
    
        return null;
    }

}

@Pipe({name: 'affectationAgentFilter'})
export class AffectationAgentFilterPipe  implements PipeTransform{

    transform(agent: any): string {

      if(agent.bureau){
        return `${agent.bureau.nom}`;
      }

      if(agent.service){
        return  `${agent.service.nom} (${agent.service.sigle})`;
      }

      if(agent.structure){
        return  `${agent.structure.nom} (${agent.structure.sigle})`;
      }

    }

}

@Pipe({
    name: 'exceptPrincipalFilter'
  })
  export class ExceptPrincipalFilterPipe implements PipeTransform {
    transform(args: any[]): any {
      return args.filter(ob => !ob.principal);
    }
  }  

/*
  @Pipe({
    name: 'remoteErrorMessageFilter'
  })
  export class RemoteErrorMessageFilterPipe implements PipeTransform {
    transform(args: Map<string,,fieldName : string ): any {
      return args.filter(ob => !ob.principal);
    }
  }  

  */