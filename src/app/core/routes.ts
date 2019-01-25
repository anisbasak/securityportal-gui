import { Routes } from '@angular/router';

import * as fromContainers from './containers';

export const routes: Routes = [
  {
    path: 'error',
    component: fromContainers.ErrorPageComponent,
  },
  {
    path: 'unauthorized',
    component: fromContainers.UnauthorizedPageComponent,
  },
];
