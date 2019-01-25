import { Routes } from '@angular/router';
import * as fromContainers from './containers';
import * as fromGuards from './guards';


export const routes: Routes = [
  {
    path: '',
    canActivate: [fromGuards.LookupKeyGuard],
    component: fromContainers.UserLookupPageComponent,
  },
  {
    path: ':userId',
    canActivate: [fromGuards.UserExistsGuard],
    component: fromContainers.UserDetailPageWrapperComponent,
  }
];
