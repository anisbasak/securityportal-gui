import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  EventEmitter,
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import _find from 'lodash-es/find';
import * as pluralize from 'pluralize';

import { shrinkOut } from '@app/shared';
import { MapDialogComponent } from '../../components/map-dialog/map-dialog.component';
import {
  DateSearch,
  DateClause,
  LocationSearch,
  BlueprintOption,
  Search,
} from '../../models';

const TOOLTIP_DELAY = 500;

type FilterType = 'blueprint' | 'date';

@Component({
  selector: 'search-form',
  styleUrls: ['./search-form.component.scss'],
  animations: [shrinkOut],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form (ngSubmit)="submit()" [formGroup]="form">
      <mat-card class="solo-input" [formGroup]="textGroup">
        <mat-icon title="Search" (click)="submit()"><span>search</span></mat-icon>
        <input type="text" formControlName="string" #searchTextField>
        <mat-icon *ngIf="textGroup.get('string').value"
          title="Clear input"
          (click)="clearSearchString()">
          <span>close</span>
        </mat-icon>
      </mat-card>

      <div class="controls">
        <!-- Filter result types button -->
        <button mat-icon-button type="button"
          class="button"
          color="accent"
          matTooltip="Filter result types"
          [matTooltipShowDelay]="_tooltipDelay"
          (click)="toggleFilter('blueprint')">
          <sp-icon-notification *ngIf="blueprintsControl.value?.length"></sp-icon-notification>
          <mat-icon>filter_list</mat-icon>
        </button>

        <!-- Map search button -->
        <button mat-icon-button type="button"
          class="button"
          color="accent"
          matTooltip="Map search"
          [matTooltipShowDelay]="_tooltipDelay"
          (click)="openMapSearchDialog()">
          <sp-icon-notification *ngIf="locationControl.value"></sp-icon-notification>
          <mat-icon>place</mat-icon>
        </button>

        <!-- Date search button -->
        <button mat-icon-button type="button"
          class="button"
          color="accent"
          matTooltip="Date search"
          [matTooltipShowDelay]="_tooltipDelay"
          (click)="toggleFilter('date')">
          <sp-icon-notification *ngIf="dateControl.value?.length"></sp-icon-notification>
          <mat-icon>date_range</mat-icon>
        </button>

        <!-- Verbatim checkbox -->
        <div class="verbatim-control" [formGroup]="textGroup">
          <mat-checkbox formControlName="verbatim">
            Verbatim
          </mat-checkbox>
        </div>
      </div>
    </form>

    <!-- Blueprints -->
    <mat-chip-list class="blueprints sat-equal-chip-margin" *ngIf="blueprintsControl.value?.length">
      <mat-chip *ngFor="let blueprint of blueprintsControl.value" @shrinkOut
        [removable]="true"
        [selectable]="false"
        (removed)="removeBlueprint(blueprint)">
        <mat-icon>share</mat-icon>
        {{ blueprint.plural }}
        <mat-icon matChipRemove>cancel</mat-icon>
      </mat-chip>
    </mat-chip-list>

    <!-- Mini map -->
    <form-mini-map class="mini-map" *ngIf="locationControl.value"
      [search]="locationControl.value"
      (edit)="openMapSearchDialog()"
      (remove)="removeLocation()">
    </form-mini-map>

    <!-- Dates -->
    <mat-chip-list class="dates" *ngIf="dateControl.value?.length">
      <mat-chip *ngFor="let clause of dateControl.value; let index=index; trackBy: index"
        [title]="getDateChipTitle(clause)"
        disabled>
        <mat-icon>date_range</mat-icon>
        <ng-container *ngFor="let statement of clause; let last=last;">
          {{ statement.trait }}<ng-container *ngIf="!last">,</ng-container>
        </ng-container>
      </mat-chip>
    </mat-chip-list>

    <!-- Blueprint selector -->
    <glb-slide [isOpen]="visibleFilter === 'blueprint'">
      <blueprint-autocomplete
        [disabledBlueprints]="blueprintsControl.value || []"
        (selection)="addBlueprint($event)">
      </blueprint-autocomplete>
    </glb-slide>

    <!-- Datetime selector -->
    <glb-slide [isOpen]="visibleFilter === 'date'">
      <date-selector
        [initialValue]="dateControl.value"
        (saved)="updateDate($event)">
      </date-selector>
    </glb-slide>
  `
})
export class SearchFormComponent implements OnInit, OnDestroy {

  /** Initial value to populate the form with. */
  @Input() initialValue: Search;

  /** Emits when search form is submitted. */
  @Output() submitForm = new EventEmitter<Search>();

  /** Reference to search text field input. */
  @ViewChild('searchTextField') searchTextField: ElementRef;

  /** Governing form group. */
  form: FormGroup;

  /** The currently open filter panel. */
  visibleFilter: FilterType;

  /** Constant delay for the button tooltips (internal use only) */
  _tooltipDelay = TOOLTIP_DELAY;

  /** Reference to an open dialog. */
  private dialogRef: MatDialogRef<MapDialogComponent>;

  /** Emits when the component is destroyed. */
  private destroy = new Subject<void>();

  constructor (
    private dialog: MatDialog,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.createForm();
    this.validateChanges();
    this.overrideFormValues(this.initialValue);
  }

  ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.destroy.next();
    this.destroy.complete();
  }

  get blueprintsControl() {
    return this.form.get('blueprints') as FormControl;
  }

  get textGroup() {
    return this.form.get('text') as FormGroup;
  }

  get dateControl() {
    return this.form.get('date') as FormControl;
  }

  get locationControl() {
    return this.form.get('location') as FormControl;
  }

  /** Clear the value of the search string. */
  clearSearchString() {
    this.textGroup.get('string').setValue('');
  }

  /** Submit the search and close filter views. */
  submit() {
    this.setFilterVisible(null);
    this.submitForm.emit(this.form.value);
  }

  /** Add a blueprint option the the blueprints array, without duplicating. */
  addBlueprint(added: BlueprintOption) {
    if (!_find(this.blueprintsControl.value, { original: added.original })) {
      this.blueprintsControl.setValue([...this.blueprintsControl.value, added]);
    }
  }

  /** Remove a blueprint option from the blueprints list. */
  removeBlueprint(removed: BlueprintOption) {
    this.blueprintsControl.setValue(this.blueprintsControl.value.filter(b => b.original !== removed.original));
  }

  /** Null the location search value. */
  removeLocation() {
    this.locationControl.setValue(null);
  }

  /** Update the date search value.  */
  updateDate(e: DateSearch) {
    this.dateControl.setValue(e);
  }

  /** Open a map dialog using the current location value. */
  openMapSearchDialog() {
    // Open the dialog
    this.dialogRef = this.dialog.open(MapDialogComponent, {
      panelClass: 'sat-no-padding-dialog',
      data: this.locationControl.value || null
    });

    // Filter out events when the dialog is dismissed without a selection
    // and update form control when selection is made
    this.dialogRef.afterClosed()
      .pipe(
        filter(x => !!x),
        takeUntil(this.destroy),
      )
      .subscribe((x: LocationSearch) => {
        this.locationControl.setValue(x);
        this.cd.markForCheck();
      });
  }

  /** Opens the specified filter. */
  setFilterVisible(filterType: FilterType) {
    this.visibleFilter = filterType;
    this.cd.markForCheck();
  }

  /** Toggles the specified filter open or closed depending on current state. */
  toggleFilter(filterType: FilterType) {
    const currentlyOpen = this.visibleFilter === filterType;
    this.setFilterVisible(currentlyOpen ? null : filterType);
  }

  /** Get the title for the date chip. */
  getDateChipTitle(clause: DateClause) {
    return `${clause.length} date ${pluralize('filters', clause.length)}`;
  }

  /** Create an empty form group. */
  private createForm() {
    this.form = this.fb.group({
      blueprints: [[], Validators.required],
      traits: null,
      text:  this.fb.group({
        string: '',
        verbatim: false,
      }),
      date: null,
      location: null
    });
  }

  /** Override form controls with search values. */
  private overrideFormValues(val: Search) {
    if (val && val.blueprints) {
      this.blueprintsControl.setValue(val.blueprints);
    }

    if (val && val.text) {
      this.textGroup.patchValue(val.text);
    }

    if (val && val.date) {
      this.dateControl.setValue(val.date);
    }

    if (val && val.location) {
      this.locationControl.setValue(val.location);
    }
  }

  /** Track changes and perform validations. */
  private validateChanges() {
    const stringControl = this.textGroup.get('string');
    const verbatimControl = this.textGroup.get('verbatim');

    stringControl.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe(val => {
        if (new RegExp(/"/g).test(val)) {
          verbatimControl.setValue(false);
          verbatimControl.disable();
        } else {
          verbatimControl.enable();
        }
      });
  }

}
