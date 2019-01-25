import {
  Component,
  ChangeDetectionStrategy,
  SimpleChanges,
  EventEmitter,
  Input,
  Output,
  OnChanges
} from '@angular/core';
import _has from 'lodash-es/has';
import _filter from 'lodash-es/filter';
import _union from 'lodash-es/union';

import { ResultsGroup, ResultsView } from '../../models';
import { Resources } from '@app/core/models';


@Component({
  selector: 'results-view',
  styleUrls: ['./results-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="results.length">

      <!-- View selectors -->
      <results-view-selectors
        [view]="view"
        [showMapView]="!!resultsWithLocation?.length"
        (selection)="changeView.emit($event)">
      </results-view-selectors>

      <ng-container [ngSwitch]="view">

        <!-- List -->
        <search-results-list *ngSwitchCase="'list'"
          [results]="results"
          [end]="end"
          [searchText]="searchText"
          (loadMore)="loadMore.emit()">
        </search-results-list>

        <!-- Groups -->
        <search-results-groups *ngSwitchCase="'group'"
          class="search-results-groups"
          [groups]="groups">
          <ng-container [ngTemplateOutlet]="loadMoreButton"></ng-container>
        </search-results-groups>

        <!-- Map -->
        <search-results-map *ngSwitchCase="'map'"
          class="search-results-map"
          [results]="resultsWithLocation">
          <ng-container [ngTemplateOutlet]="loadMoreButton"></ng-container>
        </search-results-map>

      </ng-container>

    </ng-container>

    <!-- Spinner -->
    <div *ngIf="loading" class="spinner-container">
      <mat-spinner mode="indeterminate" [strokeWidth]="2.4" [diameter]="24"></mat-spinner>
    </div>

    <!-- Load more button (template) -->
    <ng-template #loadMoreButton>
      <div class="button-container" *ngIf="!loading">
        <button mat-raised-button *ngIf="!end"
          class="button"
          color="accent"
          (click)="loadMore.emit()">
          Load More
        </button>
      </div>
    </ng-template>
  `
})
export class ResultsViewComponent implements OnChanges {

  /** All search results. */
  @Input() results: Resources = [];

  /** Search text that was used to generate this list of results. */
  @Input() searchText: string;

  /** The current view. */
  @Input() view: ResultsView;

  /** Whether new results are currently being fetched. */
  @Input() loading = false;

  /** Whether the end of the results for this particular search has been reached. */
  @Input() end = false;

  /** Emits when an additional subset of results should be loaded. */
  @Output() loadMore = new EventEmitter<void>();

  /** Emits when the results view should be changed. */
  @Output() changeView = new EventEmitter<ResultsView>();

  /** All results organized into groups by their resource model.  */
  groups: ResultsGroup[];

  /** Subset of results that contain location data. */
  resultsWithLocation: Resources;

  ngOnChanges(changes: SimpleChanges) {
    // Reorganize the results if there is a new results list or view change
    if (_has(changes, 'results') || _has(changes, 'view')) {
      this.organizeResults(this.results, this.view);
    }
  }

  /** Group the resources and make a list of which ones have location data. */
  private organizeResults(results: Resources, view: ResultsView) {
    // Organize groups
    this.groups = this.groupResources(results);

    // Separately store results containing location data
    this.resultsWithLocation = _filter(results, r => r.loc != null);

    // Change view if map view has nothing left to display
    if (!this.resultsWithLocation.length && results.length && view === 'map') {
      this.changeView.emit('list');
    }
  }

  /** Returns resources grouped by their blueprint. */
  private groupResources(resources: Resources): ResultsGroup[] {
    // Get a unique list of resource blueprints
    const blueprints = _union(this.results.map(r => r.blueprint));

    // Group all resources with their associated blueprint
    return blueprints.map(blueprint => ({
      blueprint,
      resources: _filter(resources, { blueprint })
    }));
  }

}
