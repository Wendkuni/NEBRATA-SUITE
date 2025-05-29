
import { Exoneration } from '../evaluation/exoneration.model';
import { Dossier } from '../workflow/common/general';

export class ExonerationDossier extends Dossier{
    exoneration: Exoneration;
}
