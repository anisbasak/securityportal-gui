import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { of, Observable, BehaviorSubject, Subject, Subscription } from 'rxjs';
import { takeUntil, switchMap, delay, distinctUntilChanged } from 'rxjs/operators';
import * as addDays from 'date-fns/add_days';
import * as format from 'date-fns/format';
import * as parse from 'date-fns/parse';
import _cloneDeep from 'lodash-es/cloneDeep';

import { Resource } from '@app/core/models';
import { SimpleDialog } from '@app/shared/simple-dialog';
import { DateClause, ResultsView, Search, SearchPageState } from '../models';
import { PersistenceService, State } from '../services/persistence.service';
import { SearchService, ResourceSearchQuery, ResourceSearchOptions } from '../services/search.service';

interface SearchParams {
  search: ResourceSearchQuery;
  options: ResourceSearchOptions;
}

const SEARCH_LIMIT = 25;
const RESULTS_COUNT_SUGGESTION_TRIGGER = 150;
const SUGGESTION_DELAY = 500;
const SUGGESTION_DURATION = 6000;

/**
 * This service is responsible for managing search state, proxying api calls,
 * restoring state, and managing the snackbar service.
 */
@Injectable()
export class SearchPageService implements OnDestroy {

  /** Emits when the state changes. */
  state$: Observable<SearchPageState>;

  /** Emits when the page should open the blueprint filter. */
  openBlueprintFilter$: Observable<void>;

  /** Private store for the state. Exposed via `state$`. */
  private subject: BehaviorSubject<SearchPageState>;

  /** Private subject that emits when snackbar action button is clicked. */
  private snackbarAction = new Subject<void>();

  /** Keep a reference of the subscription to allow cancellations later. */
  private searchSubscription: Subscription;

  /** Emits when service is destroyed. */
  private destroy = new Subject<void>();

  constructor(
    private searchService: SearchService,
    private persistenceService: PersistenceService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    // Initialize persistence key for this state
    this.persistenceService.registerStateKey(State.SEARCH_COMPONENT);

    // Initialize state based on merging default state with any old state
    const initialState = this.persistenceService.getState(State.SEARCH_COMPONENT);
    this.subject = new BehaviorSubject(Object.assign(this.defaultState(), initialState));

    // Assign store as an Observable alias for the subject
    this.state$ = this.subject.asObservable().pipe(distinctUntilChanged());

    // Expose private subject as an observable
    this.openBlueprintFilter$ = this.snackbarAction.asObservable();
  }

  ngOnDestroy() {
    // If the results are currently being loaded, alter state to be properly restored
    if (this.state.loading) {
      this.mergeState({ loading: false, searched: false });
    }

    // Store the current state
    this.persistenceService.setState(State.SEARCH_COMPONENT, this.state);

    // Cancel pending searches
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    // Dismiss the snackbar. Does nothing if it is not open.
    this.snackbar.dismiss();

    // Emit destroy event to cancel subscriptions
    this.destroy.next();
    this.destroy.complete();
  }

  /** Returns the current state of the store subject. */
  get state(): SearchPageState {
    return this.subject.value;
  }

  /** Updates the view state. */
  updateView(view: ResultsView): void {
    this.mergeState({ view });
  }

  /** Clear old search results and fetch new ones. */
  search(val: Search, count = SEARCH_LIMIT): void {
    const textSearch = val.text && val.text.string.trim();
    const locationSearch = val.location && val.location.point;
    const blueprintsSearch = val.blueprints && val.blueprints.length;
    const dateSearch = val.date && val.date.length;

    // Don't allow the form to be submitted if there are text and location searches
    // filled out. The API will not accept it.
    if (textSearch && locationSearch) {
      const title = 'Invalid Search';
      const message = 'General text searches and location searches must be made independently.';
      this.dialog.open(SimpleDialog, { data: { title, message } });
      return;
    }

    // Don't allow the form to be submitted if there are no search parameters at all
    if (!textSearch && !locationSearch && !blueprintsSearch && !dateSearch) {
      const title = 'Invalid Search';
      const message = 'At least one search field is required.';
      this.dialog.open(SimpleDialog, { data: { title, message } });
      return;
    }

    // Reset the results and end state. Save the search value.
    this.mergeState({
      search: val,
      end: false,
      results: [],
      suggestionShown: false
    });

    // Hit the api for new results
    this.appendResults(count);
  }

  /** Append new search results to the results. */
  next(count = SEARCH_LIMIT): void {
    if (!this.state.loading && !this.state.end) {
      this.appendResults(count);
    }
  }

  /** Override current state with provided partial state object. */
  private mergeState(val: Partial<SearchPageState>) {
    const merged = Object.assign({}, this.state, val);
    this.subject.next(merged);
  }

  /** Call the api and append results to the results list. Update state during and after. */
  private appendResults(limit: number) {
    this.mergeState({
      loading: true,
      searched: true,
      error: ''
    });

    // Perform a deep clone of the search object and manipulate into
    // the right form for the API
    const params = this.makeSearchApiCompatible(
      _cloneDeep(this.state.search),
      { limit, skip: this.state.results.length }
    );

    // Cancel any old pending search requests
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    // Search and save results
    this.searchSubscription = this.searchService
      .searchTotalCount(params.search, params.options)
      .subscribe(
        results => {
          const mergedResults = [ ...this.state.results, ...results.resources];
          this.mergeState({ loading: false, end: mergedResults.length >= results.total, results: mergedResults });

          // Open suggestion snackbar if count surpasses trigger count
          if (mergedResults.length >= RESULTS_COUNT_SUGGESTION_TRIGGER && !this.state.suggestionShown) {
            this.showSuggestion();
          }
        },
        error => {
          this.mergeState({ loading: false, error: error.txt, end: true });
        }
      );
  }

  /** Create a new page state with sensible initialization defaults. */
  private defaultState(): SearchPageState {
    return {
      search: {
        text: { string: '', verbatim: false },
        blueprints: []
      },
      error: '',
      end: false,
      loading: false,
      searched: false,
      results: [],
      view: 'list',
      suggestionShown: false,
    };
  }

  /** Massage the search state object into a search query. */
  private makeSearchApiCompatible(search: any, options: ResourceSearchOptions): SearchParams {
    // Map blueprint objects to an array of strings
    search.blueprints = search.blueprints.map(b => b.original);

    // Clean up search text
    if (search.text) {
      // Wrap if verbatim
      search.text = search.text.verbatim
        ? `"${search.text.string}"`
        : search.text.string;
    } else {
      delete search.text;
    }

    // Remove meta property from location
    if (search.location) {
      delete search.location.meta;
    } else {
      delete search.location;
    }

    // Reduce search date to api-compatible string
    if (search.date && search.date.length) {
      search.date =  search.date.map(this.convertDateClauseToString);
    } else {
      delete search.date;
    }

    // Emulate `skip` feature when `near` location search type is used
    // by increasing a "donut-shaped" search area's inner radii.
    if (search.location) {
      let minRadius = 0;
      const results = this.state.results;
      if (results.length) {
        try {
          // Increase radius by 1mm since search is inclusive
        const furthestResult = results[results.length - 1];
        const furthestResultDistance = this.getDistanceFrom(furthestResult, search.location.point)
          minRadius = furthestResultDistance + 0.001;
        } catch (err) { }
      }
      search.location.min = minRadius;
      options.skip = 0;
    }

    return { search, options };
  }

  /** Convert a DateClause into an API-valid string */
  private convertDateClauseToString(clause: DateClause): string {
    // Convert each of the clauses statements into a string
    const statements = clause.map(y => {
      let dateRange = format(parse(y.begin));
      if (y.end) {
        // Add a day to the 'end' date to make it inclusive of that day
        dateRange = `${dateRange} ${format(addDays(parse(y.begin), 1))}`;
      }
      return `${y.trait}:"${dateRange}"`;
    });

    // Join AND'd statements by a space
    return statements.join(' ');
  }

  /** Open the snackbar after a delay and emit an event when action button is clicked. */
  private showSuggestion() {
    // Delay for a short period
    of(null)
      .pipe(
        delay(SUGGESTION_DELAY),
        switchMap(() => {
          this.mergeState({ suggestionShown: true });
          return this.snackbar
            .open('Search too generic?', 'Add Filters', { duration: SUGGESTION_DURATION })
            .onAction();
        }),
        takeUntil(this.destroy),
      )
      .subscribe(() => this.snackbarAction.next());
  }

  /** Get the distance (in meters) between a resource and the given coordinate. */
  private getDistanceFrom(resource: Resource, point: [number, number]): number {
    const coordinate = this.getResourceCoordinate(resource);
    const distanceKm = this.distanceInKmBetweenCoordinates(coordinate, point);
    return distanceKm * 1000;
  }

  /** Get the coordinate of a resource. */
  private getResourceCoordinate(resource: Resource): [number, number] {
    if (!resource.loc) {
      throw Error('No resource location found');
    }

    const { geometries } = resource.loc;
    const point = geometries.find(geometry => geometry.type === 'Point');

    if (!point) {
      throw Error('No point coordinate found');
    }

    return point.coordinates as [number, number];
  }

  /**
   * Get the distance between two earth coordinates.
   * This is based on https://stackoverflow.com/a/365853/4811678
   */
  private distanceInKmBetweenCoordinates([lon1, lat1], [lon2, lat2]): number {
    const degreesToRadians = (degrees: number) => degrees * Math.PI / 180;
    const EARTH_RADIUS_KM = 6371;

    const latDistance = degreesToRadians(lat2 - lat1);
    const lonDistance = degreesToRadians(lon2 - lon1);

    const lat1Rad = degreesToRadians(lat1);
    const lat2Rad = degreesToRadians(lat2);

    const a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
              Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
  }

}
