import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import _sortBy from 'lodash-es/sortBy';
import _sortedUniqBy from 'lodash-es/sortedUniqBy';

import * as fromCore from '@app/core/store';
import { Blueprint, BlueprintTrait } from '@app/core/models';
import { DateSearch } from '../../models';

@Component({
  selector: 'date-selector',
  styleUrls: ['./date-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form">

      <!-- Form controls -->
      <div class="form-controls">
        <button mat-raised-button
          [disabled]="form.enabled"
          class="button"
          color="primary"
          type="button"
          title="Edit"
          (click)="editForm()">
          <mat-icon>edit</mat-icon>Edit
        </button>
        <button mat-raised-button
          [disabled]="form.disabled || form.invalid"
          class="button"
          color="primary"
          type="button"
          title="Save"
          (click)="saveForm()">
          <mat-icon>check</mat-icon>Save
        </button>
      </div>

      <!-- Empty message -->
      <div *ngIf="!clauses.controls.length && form.disabled" class="empty-message">
        No date statements
      </div>

      <div formArrayName="clauses">

        <!-- Clause group -->
        <div *ngFor="let clause of clauses.controls; let i=index; let last=last;" [formArrayName]="i">
          <div class="form-clause">

            <!-- Statement group -->
            <div class="form-statement" *ngFor="let statement of clause.controls; let j=index; let last=last;" [formArrayName]="j">

              <!-- Statement controls -->
              <date-selector-statement *ngIf="form.enabled"
                [parent]="statement"
                [traits]="dateTraits$ | async"
                (remove)="removeStatement(i, j)">
              </date-selector-statement>

              <!-- Disabled text -->
              <date-selector-disabled *ngIf="form.disabled"
                [trait]="statement.get('trait').value"
                [begin]="statement.get('begin').value"
                [end]="statement.get('end').value">
              </date-selector-disabled>

              <div class="separator and" *ngIf="!last">And</div>
            </div>

            <!-- AND button -->
            <button mat-button *ngIf="clause.valid && form.enabled"
              type="button"
              class="button add-clause-button"
              color="accent"
              (click)="appendEmptyStatement(clause)">
              + AND statement
            </button>
          </div>

          <div class="separator or" *ngIf="!last">Or</div>
        </div>

        <!-- OR button -->
        <button mat-button *ngIf="clauses.valid && form.enabled"
          type="button"
          class="button add-clause-button"
          color="accent"
          (click)="appendEmptyClause(clauses)">
          <ng-container *ngIf="clauses.length">+ OR statement</ng-container>
          <ng-container *ngIf="!clauses.length">Add statement</ng-container>
        </button>
      </div>
    </form>
  `
})
export class DateSelectorComponent implements OnInit {

  /** Initial search value with which to prepopulate the form. */
  @Input() initialValue: DateSearch;

  /** Emits when date search form is saved. */
  @Output() saved = new EventEmitter<DateSearch>();

  /** Form group for managing search object. */
  form: FormGroup;

  /** Stream of traits that can have date values. */
  dateTraits$: Observable<{ rule: string, key: string }[]>;

  /** A stream of all blueprints. */
  private blueprints$: Observable<Blueprint[]>;

  constructor(
    private store: Store<fromCore.CoreState>,
    private fb: FormBuilder
  ) {
    this.blueprints$ = this.store.pipe(select(fromCore.getAllBlueprints));
  }

  ngOnInit() {
    // Request a list of available resource rules and find
    // the ones with date traits
    this.dateTraits$ = this.blueprints$
      .pipe(
        map(blueprints => {
          const allDateBlueprintTraits = blueprints.reduce((accum, curr) => {
            return accum.concat(curr.traits.filter(t => t.dataType === 'date'));
          }, [] as BlueprintTrait[]);

          const sortedDateBlueprintTraits = _sortBy(allDateBlueprintTraits, t => t.rule);
          const dateBlueprintTraits = _sortedUniqBy(sortedDateBlueprintTraits, t => t.rule);

          return dateBlueprintTraits.map(trait => ({ rule: trait.rule, key: trait.key }));
        })
      );

    // Initialize the form
    if (Array.isArray(this.initialValue)) {
      this.createForm(this.initialValue);
    } else {
      this.createEmptyForm();
    }
  }

  /** Form clauses shortcut. */
  get clauses(): FormArray {
    return this.form.get('clauses') as FormArray;
  }

  /** Remove a statement from the specified indices. */
  removeStatement(clauseIndex: number, statementIndex: number) {
    const clause = this.clauses.at(clauseIndex) as FormArray;

    // Return if clause index was invalid
    if (!clause) {
      return;
    }

    // Remove statement and clause if now empty
    clause.removeAt(statementIndex);
    if (clause.length === 0) {
      this.clauses.removeAt(clauseIndex);
    }
  }

  /** Add an empty statement to the provided clause. */
  appendEmptyStatement(clause: FormArray) {
    clause.push(this.createStatement(null, null, null));
  }

  /** Add an empty clause to the provided clause array. */
  appendEmptyClause(clauses: FormArray) {
    const newClause = this.fb.array([]);
    this.appendEmptyStatement(newClause);
    clauses.push(newClause);
  }

  /** Enable the form for editing. */
  editForm() {
    this.form.enable();
  }

  /** Disable the form and emit new form value. */
  saveForm() {
    this.saved.emit(this.form.value.clauses);
    this.form.disable();
  }

  /** Create a form and fill it with one empty clause. */
  private createEmptyForm() {
    const clauses = this.fb.array([]);
    this.appendEmptyClause(clauses);
    this.form = this.fb.group({clauses});
  }

  /** Create a form pre populated with the provided search value. */
  private createForm(val: DateSearch) {
    const clauses = val.map(clause => {
      const statements = clause.map(s => this.createStatement(s.trait, s.begin, s.end));
      return this.fb.array(statements);
    });

    this.form = this.fb.group({
      clauses: this.fb.array(clauses)
    });

    this.form.disable();
  }

  /** Create a statement with the appropriate validation. */
  private createStatement(trait, begin, end): FormGroup {
    return this.fb.group({
      trait: [trait, Validators.required],
      begin: [begin, Validators.required],
      end: end
    });
  }

}
