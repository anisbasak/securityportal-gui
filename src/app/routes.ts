import { Routes } from '@angular/router';

import { AuthGuard } from '@app/auth';
import { RouteAccessGuard } from '@app/core/guards';

// TODO: Move into CoreModule routes. See note below.
import { MissingPageComponent } from './core/containers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dash',
    pathMatch: 'full'
  },
  {
    path: 'dash',
    canActivate: [AuthGuard],
    canLoad: [RouteAccessGuard],
    loadChildren: 'app/features/dashboard/dashboard.module#DashboardModule',
  },
  {
    path: 'help',
    loadChildren: 'app/features/help/help.module#HelpModule',
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    canLoad: [RouteAccessGuard],
    loadChildren: 'app/features/profile/profile.module#ProfileModule',
  },
  {
    path: 'view',
    canActivate: [AuthGuard],
    canLoad: [RouteAccessGuard],
    loadChildren: 'app/features/view/view.module#ViewModule',
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    canLoad: [RouteAccessGuard],
    loadChildren: 'app/features/admin/admin.module#AdminModule',
  },
  {
    path: 'search',
    canActivate: [AuthGuard],
    canLoad: [RouteAccessGuard],
    loadChildren: 'app/features/search/search.module#SearchModule',
  },
  {
    path: 'user-lookup',
    canActivate: [AuthGuard],
    canLoad: [RouteAccessGuard],
    loadChildren: 'app/features/user-lookup/user-lookup.module#UserLookupModule',
  },

  // TODO: ideally this route would be registered in CoreModule where
  // the component is declared, however there appears to be a bug with
  // how Angular merges routing configs. If this route is registered in
  // CoreModule, then none of the above paths can be accessed. Reassess
  // after https://github.com/angular/angular/issues/12648 is closed.
  {
    path: '**',
    canActivate: [AuthGuard],
    component: MissingPageComponent,
  },
];
