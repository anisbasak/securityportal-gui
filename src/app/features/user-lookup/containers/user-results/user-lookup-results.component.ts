import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, Subject, of, timer } from 'rxjs';
import { map, takeUntil, pairwise, switchMap, tap, delay, take } from 'rxjs/operators';

import * as fromCore from '@app/core/store';
import * as fromRoot from '@app/store';
import * as fromModels from '../../models';
import * as fromStore from '../../store';

const PREVIEW_SLIDE_DELAY = 200;

@Component({
  selector: 'app-user-lookup-results',
  styleUrls: ['./user-lookup-results.component.scss'],
  animations: [
    trigger('listStagger', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger('15ms', animate(
              '150ms ease-out',
              style({ opacity: 1, transform: 'translateY(0px)' })
            ))
          ],
          { optional: true }
        ),
      ])
    ]),
    trigger('previewSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate(`${PREVIEW_SLIDE_DELAY}ms ease-out`, style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
      transition(':leave', [
        animate(`${PREVIEW_SLIDE_DELAY}ms ease-in`, style({ opacity: 0, transform: 'translateX(30px)' })),
      ]),
    ]),
  ],
  template: `
    <div class="result-container">
      <div *ngIf="noResults$ | async">None found</div>
      <ng-container *ngIf="results$ | async as users">
        <div [@listStagger]="users.length">
          <div *ngFor="let user of users" class="result" (click)="previewUser(user)">
            <resource-avatar class="result__avatar" [avatarMd5]="user.avatar" [name]="user.name"></resource-avatar>
            <span class="result__name">{{ user.name }}</span>
            <div
              class="result__detail"
              (click)="$event.stopPropagation(); viewUser(user)"
              matTooltip="View details"
              matTooltipShowDelay="200">
              <mat-icon>launch</mat-icon>
            </div>
          </div>
        </div>
      </ng-container>
    </div>

    <div class="preview-container">
      <div class="preview" [@previewSlide]="user" *ngIf="showPreviewFor$ | async; let user">
        <button mat-icon-button class="preview__detail" matTooltip="View details" (click)="viewUser(user)">
          <mat-icon>launch</mat-icon>
        </button>
        <app-user-detail-hero [user]="user"></app-user-detail-hero>
      </div>
    <div>
  `
})
export class UserLookupResultsComponent implements OnInit, OnDestroy {

  results$: Observable<fromModels.UserLookupResponse[]>;
  noResults$: Observable<boolean>;
  showPreviewFor$: Observable<fromModels.User>;
  previewVisible: boolean;

  private destroy = new Subject<void>();

  constructor(
    private store: Store<fromCore.CoreState>,
    private breakpointObserver: BreakpointObserver,
    public _location: Location,
  ) {}


  ngOnInit() {
    // Clear the preview every time this component is loaded
    this.store.dispatch(new fromStore.ClearPreviewUser());

    // Setup observables
    this.results$ = this.store.pipe(select(fromStore.getLookupResults));
    this.noResults$ = combineLatest(
      this.store.pipe(select(fromStore.getLookupResults)),
      this.store.pipe(select(fromStore.getLookupResultsLoaded)),
    ).pipe(
      map(([results, loaded]) => loaded && results.length === 0),
    );

    // Debounce preview selections to allow for enter and exit animations
    // to complete befoore showing new preview panel.
    this.showPreviewFor$ = this.store.pipe(
      select(fromStore.getPreviewUser),
      pairwise(),
      switchMap(([last, next]) => {
        // Enter
        if (!last && next) {
          return of(next).pipe(delay(PREVIEW_SLIDE_DELAY));
        }

        // Change
        if (last && next && last !== next) {
          const vals = [undefined, next];
          return timer(0, PREVIEW_SLIDE_DELAY).pipe(
            take(2),
            map(i => vals[i])
          );
        }

        // Default (including leave)
        return of(next);
      }),
      tap(val => console.log(val))
    );

    // Hide the preview on mobile
    // Note: this breakpoint is coupled with the css
    this.breakpointObserver
      .observe('(min-width: 600px)')
      .pipe(
        map(state => state.matches),
        takeUntil(this.destroy),
      ).subscribe(match => this.previewVisible = match);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  previewUser(user: fromModels.UserLookupResponse) {
    // If the preview is not visible, redirect preview actions to the detail view
    if (!this.previewVisible) {
      return this.viewUser(user);
    }

    this.store.dispatch(new fromStore.PreviewUser({ id: user._id }));
  }

  viewUser(user: fromModels.UserLookupResponse) {
    this.store.dispatch(new fromRoot.Go({ path: ['user-lookup', user._id] }));
  }

}
