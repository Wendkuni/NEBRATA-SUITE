import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { of } from "rxjs";
import {AgentsService} from '@sycadApp/services/data-references/contribuables/agent.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuablePhysiqueService} from '@sycadApp/services/data-references/contribuables/contribuable-physique.service';
import {ContribuableMoralService} from '@sycadApp/services/data-references/contribuables/contribuable-moral-service';
import {IndivisionsService} from '@sycadApp/services/data-references/contribuables/indivisions.service';

@Injectable()
export class AgentResolverService implements Resolve<any> {
  constructor(private agentsService: AgentsService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const guid = route.paramMap.get("guid");

    return this.agentsService.isExist(guid).subscribe((res) => {
      if (res.status === 204) {
        location.href = "/contribuables/agents";
        return of(null);
      } else {
        return of(null);
      }
    });
  }
}

@Injectable()
export class ActeurResolverService implements Resolve<any> {
  constructor(private acteursService: ActeursService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const guid = route.paramMap.get("guid");

    return this.acteursService.isExist(guid).subscribe((res) => {
      if (res.status === 204) {
        location.href = "/contribuables/acteurs";
        return of(null);
      } else {
        return of(null);
      }
    });
  }
}

@Injectable()
export class ContribuablePhysiqueResolverService implements Resolve<any> {
  constructor(private contribuablePhysiqueService: ContribuablePhysiqueService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const guid = route.paramMap.get("guid");

    return this.contribuablePhysiqueService.isExist(guid).subscribe((res) => {
      if (res.status === 204) {
        location.href = "/contribuables/contribuable-physique";
        return of(null);
      } else {
        return of(null);
      }
    });
  }
}

@Injectable()
export class ContribuableMoralResolverService implements Resolve<any> {
  constructor(private contribuableMoralService: ContribuableMoralService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const guid = route.paramMap.get("guid");

    return this.contribuableMoralService.isExist(guid).subscribe((res) => {
      if (res.status === 204) {
        location.href = "/contribuables/contribuable-moral";
        return of(null);
      } else {
        return of(null);
      }
    });
  }
}

@Injectable()
export class IndivisionResolverService implements Resolve<any> {
  constructor(private indivisionsService: IndivisionsService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const guid = route.paramMap.get("guid");

    return this.indivisionsService.isExist(guid).subscribe((res) => {
      if (res.status === 204) {
        location.href = "/contribuables/indivisions";
        return of(null);
      } else {
        return of(null);
      }
    });
  }
}
