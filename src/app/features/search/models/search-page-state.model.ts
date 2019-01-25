import { Resources } from '@app/core/models';
import { Search } from './search.model';
import { ResultsView } from './results-view.model';

export interface SearchPageState {
  /** Most recent search object. */
  search: Search;

  /** Error to be displayed. */
  error: string;

  /** Whether the end of the results have been reached. */
  end: boolean;

  /** Whether a search is currently being performed. */
  loading: boolean;

  /** Whether at least one search has been done. */
  searched: boolean;

  /** A list of results for the current search. */
  results: Resources;

  /** The page's current results view. */
  view: ResultsView;

  /** Whether the snackbar suggestion has been shown. */
  suggestionShown: boolean;
}
