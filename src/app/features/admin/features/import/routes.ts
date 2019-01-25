import { Routes } from '@angular/router';

import * as fromContainers from './containers';
import * as fromGuards from './guards';

export const routes: Routes = [
  {
    path: '',
    canActivate: [
      fromGuards.SchedulesGuard,
      fromGuards.TasksGuard,
    ],
    component: fromContainers.ImportOverviewPageComponent,
  },
];
