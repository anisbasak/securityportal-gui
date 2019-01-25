import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { tap, startWith, map, takeUntil } from 'rxjs/operators';
import _escapeRegExp from 'lodash-es/escapeRegExp';

import { AvatarUtil } from '@app/core/util';
import { Resource, Resources } from '@app/core/models';
import { UserSearchService } from '../../services';

@Component({
  selector: 'sp-user-autocomplete',
  styleUrls: ['./user-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Input -->
    <mat-form-field [color]="color" [floatLabel]="floatLabel">
      <input matInput
        type="text"
        [placeholder]="placeholder"
        [formControl]="searchControl"
        [matAutocomplete]="autocomplete">
      <mat-icon matSuffix
        class="clear-input"
        *ngIf="searchControl.value"
        (click)="clearSelection()">
        close
      </mat-icon>
      <mat-error>Please select a user from the list</mat-error>
    </mat-form-field>

    <!-- Autocomplete -->
    <mat-autocomplete #autocomplete="matAutocomplete" [displayWith]="getNull">
      <mat-option *ngFor="let user of filteredUsers$ | async"
        [value]="user"
        [disabled]="isDisabled(user)">
        <sp-user-option
          [avatarMd5]="getAvatarMd5(user)"
          [name]="getTitle(user)"
          [searchTerm]="getTitle(searchControl.value)">
        </sp-user-option>
      </mat-option>
    </mat-autocomplete>
  `
})
export class UserAutocompleteComponent implements OnInit, AfterViewInit, OnDestroy {
  /** Color property to be passed to autocomplete input. */
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';

  /** Placeholder to be displayed by autocomplete input. */
  @Input() placeholder = 'Search for a user';

  /** Whether to show placeholder. */
  @Input() floatLabel: 'always' | 'never' | 'auto' = 'auto';

  /** Whether a value is required. */
  @Input()
  set required(v: boolean) {
    if (v) {
      this.searchControl.setValidators(Validators.required);
    } else {
      this.searchControl.clearValidators();
    }
  }

  /** A search query to filter the users in the autocomplete select. */
  @Input()
  get searchFilter() { return this._searchFilter; }
  set searchFilter(v: string) {
    this._searchFilter = v;
    this.updateUsersList();
  }

  /** A list a resource IDs that should show, but be disabled. */
  @Input() disabledIDs: string[] = [];

  /** Event that is emitted whenever a user is selected from the list. */
  @Output() selection = new EventEmitter<Resource>();

  /** Reference to the autocomplete component. Required for template linting. */
  autocomplete: ElementRef;

  /** Stream of users filtered by end-user input. */
  filteredUsers$: Observable<Resources>;

  /** Form control for user search input. */
  searchControl: FormControl;

  /** Array of users that can be filtered by the autocomplete. */
  users: Resources = [];

  /** Reference to the autocomplete trigger instance */
  @ViewChild(MatAutocompleteTrigger)
  private autoTrigger: MatAutocompleteTrigger;

  /** Subject that emits whenever a new array of users is available. */
  private newOptions$ = new Subject<void>();

  /** Private store for search filter */
  private _searchFilter: string;

  /** Private store for any active search subscriptions. */
  private searchSub: Subscription;

  /** Subject that emits when the component is being destroyed. */
  private destroy = new Subject<void>();

  constructor(private searchService: UserSearchService) {
    this.searchControl = new FormControl('');
  }

  ngOnInit() {
    // Stream of changes by the search input
    const searchChanges$ = this.searchControl.valueChanges.pipe(startWith(''));

    // Emit each time user types in input or new user options are available
    this.filteredUsers$ = combineLatest(searchChanges$, this.newOptions$).pipe(
      map(val => this.filterUsers(val[0])));
  }

  ngAfterViewInit() {
    // Clear the input and emit when a selection is made
    this.autoTrigger.autocomplete.optionSelected
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

  /** Clears the input */
  clearSelection() {
    setTimeout(() => this.searchControl.setValue(null));
  }

  /** Return a user's main avatar MD5 */
  getAvatarMd5(user: Resource) {
    return AvatarUtil.getAvatarBySize(user.avatar, 'small');
  }

  /** Return a user's preferred title */
  getTitle(user: Resource) {
    return user.name || user;
  }

  /** Noop method to show a resource as null */
  getNull(user: Resource) {
    return null;
  }

  /** Returns whether the user option is on the disabled list. */
  isDisabled(user: Resource) {
    return this.disabledIDs.includes(user._id);
  }

  /**
   * Search for users that match the filter. Then sort the results
   * by name and save to local users store.
   */
  private updateUsersList() {
    if (this._searchFilter) {
      // Cancel any existing search subscriptions
      if (this.searchSub) {
        this.searchSub.unsubscribe();
      }
      // Perform search using search filter
      this.searchSub = this.searchService.search(this._searchFilter)
        .pipe(
          map(users => users.sort((a, b) => this.compareResourcesByTitle(a, b))),
          tap(users => this.setUsersAndClearInput(users)),
          takeUntil(this.destroy),
        )
        .subscribe();
    } else {
      // No search query so don't perform search
      this.setUsersAndClearInput([]);
    }
  }

  /**
   * Save users and clear the search input if the previously selected user
   * is not in the updated user list.
   */
  private setUsersAndClearInput(users: Resources) {
    // Update storage
    this.users = users;

    // Optionally clear input if current value is no longer in new user list
    const val = this.searchControl.value as Resource;
    if (val && val.name && val._id) {
      if (!this.users.find(user => user._id === val._id)) {
        this.clearSelection();
      }
    }

    // Emit to subject that users have been updated
    this.newOptions$.next();
  }

  /** Returns a list of users that have regex matches of the string/Resource argument */
  private filterUsers(val: any) {
    // If no filter is applied, return the whole list
    if (!val) {
      return this.users;
    }

    // If the filter is actually a resource, use its title as a filter
    if (val.name) {
      val = val.name;
    }

    // Return filtered list of users
    const regex = new RegExp(_escapeRegExp(val as string), 'i');
    return this.users.filter(user => regex.test(user.name));
  }

  /** Compare resources based on their title. Returns -1, 0, or 1 */
  private compareResourcesByTitle(a: Resource, b: Resource): number {
    return a.name.localeCompare(b.name);
  }
}
