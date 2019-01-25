import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MatTableModule, MatSortModule } from '@angular/material';
import { SatPopoverModule } from '@ncstate/sat-popover';

import { reducers, effects } from './store';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import * as fromServices from './services';
import * as fromGuards from './guards';
import { routes } from './routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('import', reducers),
    EffectsModule.forFeature(effects),
    MatTableModule,
    MatSortModule,
    SatPopoverModule,
  ],
  declarations: [
    ...fromComponents.components,
    ...fromContainers.containers,
  ],
  providers: [
    fromServices.ImportService,
    ...fromGuards.guards
  ],
})
export class ImportModule { }
