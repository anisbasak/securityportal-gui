import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { style, transition, trigger, animate } from '@angular/animations';

import { Resource, Resources } from '@app/core/models';
import { SCROLL_CONTAINER_SELECTOR } from '../../constants';

// TODO(will): can't use string interpolation with anything that is
// aot compiled
// `${TIMING.xsmall.enterScreen} ${CURVE.deceleration}`
const FADE_IN_UP = '225ms cubic-bezier(0.0, 0.0, 0.2, 1)';

@Component({
  selector: 'search-results-list',
  styleUrls: ['./results-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // TODO(will): stagger animations when staggering is available
  // https://github.com/angular/angular/pull/15574
  animations: [
    trigger('fadeInAndUp', [
      transition('void => *', [
        style({ opacity: '0', transform: 'translate3d(0px,88px,0px)' }),
        animate(FADE_IN_UP, style({ opacity: '1', transform: 'translate3d(0px,0px,0px)' }))
      ])
    ])
  ],
  template: `
    <!-- List -->
    <mat-list dense
      infiniteScroll
      [infiniteScrollContainer]="scrollContainerSelector"
      (scrolledPastTrigger)="loadMore.emit()">
      <resource-list-item *ngFor="let result of results; trackBy: trackByFn"
        [searchTerm]="searchText"
        [resource]="result" @fadeInAndUp>
      </resource-list-item>
    </mat-list>

    <ng-content></ng-content>

    <!-- End indicator -->
    <div *ngIf="end" class="end-icon" @fadeInAndUp>
      <mat-icon>more_horiz</mat-icon>
    </div>
  `
})
export class ResultListComponent {

  /** Resources to be displayed in a list. */
  @Input() results: Resources;

  /** Search text to illuminate matches with original search. */
  @Input() searchText: string;

  /** Whether the end of the search results has been reached. */
  @Input() end: boolean;

  /** Emits when more results should be loaded. */
  @Output() loadMore = new EventEmitter<void>();

  /** Reference selector for infinite scroll container. */
  scrollContainerSelector = SCROLL_CONTAINER_SELECTOR;

  /** Returns unique ID of a result. */
  trackByFn(index: number, result: Resource) {
    return result._id;
  }
}
