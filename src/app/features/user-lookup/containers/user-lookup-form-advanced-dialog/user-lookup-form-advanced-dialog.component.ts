import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import * as fromCore from '@app/core/store';
import * as fromModels from '../../models';
import * as fromStore from '../../store';

@Component({
  selector: 'app-user-lookup-form-advanced-dialog',
  styleUrls: ['./user-lookup-form-advanced-dialog.component.scss'],
  template: `
    <div matDialogTitle>Advanced Lookup</div>

    <mat-dialog-content>
      <app-lookup-key *ngFor="let key of systemUserKeys$ | async"
        [key]="key"
        [value]="getUserValueFor(key) | async"
        (fieldChange)="updateUserField($event)">
      </app-lookup-key>

      <p>And is related to a(n)...</p>

      <app-link-selector
        [blueprints]="linkBlueprints$ | async"
        [selection]="selectedLinkBlueprint$ | async"
        (linkChange)="updateLink($event)">
      </app-link-selector>

      <button type="button" (click)="updateLink(null)">Clear</button>

      <ng-container *ngIf="selectedLinkBlueprint$ | async; let selection;">
        <app-lookup-key *ngFor="let key of linkKeys$ | async"
          [key]="key"
          [value]="getLinkValueFor(key) | async"
          (fieldChange)="updateLinkField($event)">
        </app-lookup-key>
      </ng-container>
    </mat-dialog-content>
  `
})
export class UserLookupFormAdvancedDialogComponent implements OnInit {
  /** Lookup keys for a system user. */
  systemUserKeys$: Observable<fromModels.LookupKey[]>;

  /** Lookup keys for the selected link blueprint. */
  linkKeys$: Observable<fromModels.LookupKey[]>;

  /** All possible link keys. */
  links$: Observable<fromModels.LookupKeysForLink[]>;

  /** All possible link blueprints. */
  linkBlueprints$: Observable<string[]>;

  /** Current selection of link blueprint. */
  selectedLinkBlueprint$: Observable<string>;

  constructor(
    private store: Store<fromCore.CoreState>,
  ) { }

  ngOnInit() {
    const allKeys$ = this.store.pipe(select(fromStore.getLookupKeys));

    this.selectedLinkBlueprint$ = this.store.pipe(select(fromStore.getLinkBlueprint));

    this.systemUserKeys$ = allKeys$.pipe(map(all => all.keys));
    this.links$ = allKeys$.pipe(map(all => all.links));
    this.linkBlueprints$ = this.links$.pipe(map(links => links.map(link => link.blueprint)));

    this.linkKeys$ = this.selectedLinkBlueprint$
      .pipe(
        switchMap(selection => {
          if (!selection) {
            return of([]);
          }

          return this.links$.pipe(map(links => links.find(l => l.blueprint === selection).keys));
        })
      );
  }

  getUserValueFor(key: fromModels.LookupKey): Observable<fromModels.LookupField> {
    return this.store.pipe(select(fromStore.getUserField(key.key)));
  }

  getLinkValueFor(key: fromModels.LookupKey): Observable<fromModels.LookupField> {
    return this.store.pipe(select(fromStore.getLinkField(key.key)));
  }

  updateUserField(change: fromModels.LookupFieldChange) {
    this.store.dispatch(new fromStore.UpdateFormUserField(change));
  }

  updateLinkField(change: fromModels.LookupFieldChange) {
    this.store.dispatch(new fromStore.UpdateFormLinkField(change));
  }

  updateLink(blueprint: string) {
    this.store.dispatch(new fromStore.UpdateFormLinkSelection({ blueprint }));
  }

}
