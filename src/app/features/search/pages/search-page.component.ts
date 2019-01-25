import { ChangeDetectionStrategy, Component, ViewChild, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromCore from '@app/core/store';
import * as fromStore from '@app/store';
import { smoothScroll } from '@app/shared';
import { SCROLL_CONTAINER_SELECTOR } from '../constants';
import { SearchPageService } from '../pages/search-page.service';
import { ResultsView, Search, SearchPageState } from '../models';
import { SearchFormComponent } from '../containers/search-form/search-form.component';


@Component({
  selector: 'search-page',
  styleUrls: ['./search-page.component.scss'],
  providers: [SearchPageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Wrap async pipe -->
    <ng-container *ngIf="state$ | async; let state">

      <!-- Form -->
      <search-form
        #searchForm
        [initialValue]="state.search"
        (submitForm)="submitForm($event)">
      </search-form>

      <!-- Error -->
      <div *ngIf="state.error" class="subheading">
        {{ state.error }}
      </div>

      <!-- Results text -->
      <div *ngIf="!state.results.length && !state.loading && !state.error && state.searched"
        class="subheading italics">
        No results
      </div>

      <!-- Results -->
      <results-view
        [results]="state.results"
        [view]="state.view"
        [end]="state.end"
        [loading]="state.loading"
        [searchText]="state.search.text?.string"
        (changeView)="updateView($event)"
        (loadMore)="loadMore()">
      </results-view>

    </ng-container>
  `
})
export class SearchPageComponent implements OnInit {

  /** Stream of state changes. */
  state$: Observable<SearchPageState>;

  /** Reference to the search form component. */
  @ViewChild(SearchFormComponent)
  private searchForm: SearchFormComponent;

  constructor(
    private searchPageService: SearchPageService,
    private store: Store<fromStore.State>,
  ) {
    this.state$ = this.searchPageService.state$;
  }

  ngOnInit() {
    this.store.dispatch(new fromCore.SetFeatureTitle({ title: 'Search' }));

    // Scroll to the top and open the blueprint filter when the page
    // service emits
    this.searchPageService
      .openBlueprintFilter$
      .subscribe(() => this.openBlueprintFilter());
  }

  /** Update the view in the page state. */
  updateView(view: ResultsView) {
    this.searchPageService.updateView(view);
  }

  /** Submit the form with the provided value. */
  submitForm(val: Search) {
    this.searchPageService.search(val);
  }

  /** Append new results to the current results list. */
  loadMore() {
    this.searchPageService.next();
  }

  /** Scroll to the search text field and open up the blueprint filter. */
  private openBlueprintFilter() {
    if (this.searchForm && this.searchForm.searchTextField) {
      const scrollToElement = this.searchForm.searchTextField.nativeElement;
      const scrollContainer = <HTMLElement>document.querySelector(SCROLL_CONTAINER_SELECTOR);

      smoothScroll(scrollToElement, scrollContainer, 500, 'easeInOutQuad')
        .then(() => this.searchForm.setFilterVisible('blueprint'));
    }
  }
}
