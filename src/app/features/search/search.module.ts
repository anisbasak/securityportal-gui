import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/common';
import { ResourceModule } from '@app/shared/resource';
import { IconNotificationModule } from '@app/shared/icon-notification';
import { SimpleDialogModule } from '@app/shared/simple-dialog';

import * as coreGuards from '@app/core/guards';

// pages
import { SearchPageComponent } from './pages/search-page.component';

// components
import { DateSelectorDisabledComponent } from './components/date-selector-disabled/date-selector-disabled.component';
import { DateSelectorStatementComponent } from './components/date-selector-statement/date-selector-statement.component';
import { FormMiniMapComponent } from './components/form-mini-map/form-mini-map.component';
import { MapDialogComponent } from './components/map-dialog/map-dialog.component';
import { ResultGroupsComponent } from './components/results-groups/results-groups.component';
import { ResultListComponent } from './components/results-list/results-list.component';
import { ResultsMapComponent } from './components/results-map/results-map.component';
import { ResultsViewComponent } from './components/results-view/results-view.component';
import { ResultsViewSelectorsComponent } from './components/results-view-selectors/results-view-selectors.component';

// containers
import { SearchFormComponent } from './containers/search-form/search-form.component';
import { BlueprintAutocompleteComponent } from './containers/blueprint-autocomplete/blueprint-autocomplete.component';
import { DateSelectorComponent } from './containers/date-selector/date-selector.component';

// directives
import { InfiniteScrollDirective } from './directives/infinite-scroll.directive';

// services
import { PersistenceService } from './services/persistence.service';
import { SearchService } from './services/search.service';
import { ResourceService } from './services/resource.service';

export const routes: Routes = [
  {
    path: '',
    canActivate: [
      coreGuards.BlueprintsGuard,
    ],
    component: SearchPageComponent,
    data:  { title: null }
  }
];

@NgModule({
  imports: [
    SharedModule,
    ResourceModule,
    IconNotificationModule,
    SimpleDialogModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    // pages
    SearchPageComponent,
    // components
    DateSelectorDisabledComponent,
    DateSelectorStatementComponent,
    FormMiniMapComponent,
    MapDialogComponent,
    ResultGroupsComponent,
    ResultListComponent,
    ResultsMapComponent,
    ResultsViewComponent,
    ResultsViewSelectorsComponent,
    // containers
    SearchFormComponent,
    BlueprintAutocompleteComponent,
    DateSelectorComponent,
    // directives
    InfiniteScrollDirective
  ],
  providers: [
    PersistenceService,
    SearchService,
    ResourceService,
  ],
  entryComponents: [
    MapDialogComponent,
  ]
})
export class SearchModule { }
