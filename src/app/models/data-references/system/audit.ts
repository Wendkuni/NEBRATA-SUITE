import { ActionType } from "./model";

export class Audit {
  id: number;

  date: Date;

  userAgent: string;

  userIp: string;

  clientOS: string;

  clientBrowser: string;

  userGuid: string;

  ressource: string;

  actionType: ActionType;

  content: Map<string, string>;
}
