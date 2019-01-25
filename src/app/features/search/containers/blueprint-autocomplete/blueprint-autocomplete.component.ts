import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';
import * as pluralize from 'pluralize';

import { ResourceService } from '../../services/resource.service';
import { BlueprintOption } from '../../models';

@Component({
  selector: 'blueprint-autocomplete',
  styleUrls: ['blueprint-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Input -->
    <mat-form-field color="accent" floatLabel="never">
      <input matInput
        placeholder="What would you like to search for?"
        [matAutocomplete]="auto"
        [formControl]="searchControl">
    </mat-form-field>

    <!-- Autocomplete -->
    <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayNull">
      <mat-option *ngFor="let option of filteredOptions$ | async"
        [value]="option"
        [disabled]="isDisabled(option)">
        <span [innerHTML]="option.plural | bold:searchControl.value"></span>
      </mat-option>
    </mat-autocomplete>
  `
})
export class BlueprintAutocompleteComponent implements AfterViewInit, OnInit, OnDestroy {

  /** A list of blueprint options that should show, but be disabled. */
  @Input() disabledBlueprints: BlueprintOption[] = [];

  /** Emits whenever a selection has been made. */
  @Output() selection = new EventEmitter<BlueprintOption>();

  /** Form control for the search input. */
  searchControl: FormControl;

  /** A stream of options filtered by the user's search input. */
  filteredOptions$: Observable<BlueprintOption[]>;

  /** Reference to the autocomplete trigger. */
  @ViewChild(MatAutocompleteTrigger)
  private trigger: MatAutocompleteTrigger;

  /** Emits when new options are available. */
  private newOptions$ = new Subject<void>();

  /** Emits when the component is being destroyed. */
  private destroy = new Subject<void>();

  /** A list of all possible options before filtering. */
  private options: BlueprintOption[] = [];

  constructor(private resourceService: ResourceService) { }

  ngOnInit() {
    // Initialize form control
    this.searchControl = new FormControl('');

    // Stream of changes by the input
    const searchChanges$ = this.searchControl.valueChanges.pipe(startWith(''));

    // Emit each time user types in input or new blueprints are available
    this.filteredOptions$ = combineLatest(
        searchChanges$,
        this.newOptions$.pipe(startWith(null))
      )
      .pipe(
        map(val => this.filterOptions(val[0]))
      );

    // Request a list of available resource blueprints
    this.resourceService.getBlueprints()
      .pipe(
        map(blueprints => blueprints.map(b => b.name).sort()),
        map(blueprints => blueprints.map(b => ({ original: b, plural: pluralize.plural(b) }))),
        takeUntil(this.destroy),
      )
      .subscribe((blueprints: BlueprintOption[]) => {
        this.options = blueprints;
        this.newOptions$.next();
      });
  }

  ngAfterViewInit() {
    // Clear the input and emit when a selection is made
    this.trigger.autocomplete.optionSelected
      .pipe(
        map(event => event.option),
        takeUntil(this.destroy),
      )
      .subscribe(option => {
        this.selection.emit(option.value);
        this.searchControl.setValue('');
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  /** Display function for selected autocomplete values. */
  displayNull(blueprint: BlueprintOption) {
    return null;
  }

  /** Returns whether this blueprint option is on the disabled list. */
  isDisabled(blueprint: BlueprintOption) {
    return !!this.disabledBlueprints.find(b => b.original === blueprint.original);
  }

  /** Return filtered option list based on input. */
  private filterOptions(val: string | BlueprintOption): BlueprintOption[] {
    if (!val) {
      return this.options;
    }

    const newVal: string = val['plural'] || val;

    return this.options
      .filter(o => o.plural.toLowerCase().includes(newVal.toLowerCase()));
  }
}
