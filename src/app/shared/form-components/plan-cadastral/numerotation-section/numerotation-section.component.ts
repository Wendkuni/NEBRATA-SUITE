import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, Validators} from '@angular/forms';
import {BehaviorSubject, of} from 'rxjs';

@Component({
  selector: 'app-numerotation-section',
  templateUrl: './numerotation-section.component.html',
  styleUrls: ['./numerotation-section.component.scss']
})
export class NumerotationSectionComponent implements OnInit {
  @Input('formGroup')
  sectionAAjouter: FormArray;

  @Input('sectionsChoisie')
  sectionsChoisie: any[];

  public dataSource = new BehaviorSubject<AbstractControl[]>([]);
  public displayedColumns: string[] = ['numeroAncien',  'ordre'];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.sectionsChoisie && this.sectionsChoisie.length > 0) {
      this.sectionsChoisie.map((section) => {
        this.sectionAAjouter.insert(0, this.createSection(section));
        this.updateTableSection();
      });
    }
  }

  createSection(section: any = null) {
    if (section == null) {
      return this.fb.group({
        id: [null, ],
        ordre: [null],
        numeroAncien: [null]
      });
    } else {
      return this.fb.group({
        id: [section.id],
        ordre: [section?.ordre],
        numeroAncien: [section?.numeroAncien]
      });
    }
  }

  public updateTableSection() {
    this.dataSource.next(this.sectionAAjouter.controls);
  }

}
