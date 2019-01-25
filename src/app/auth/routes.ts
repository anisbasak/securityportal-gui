import { Routes } from '@angular/router';
import * as fromContainers from './containers';

export const routes: Routes = [
  {
    path: 'oauth',
    children: [
      { path: 'callback', component: fromContainers.OauthCallbackPageComponent },
      { path: 'sign-out', component: fromContainers.SignOutPageComponent }
    ],
  },
];
