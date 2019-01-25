import { Routes } from '@angular/router';

export interface AdminFeature {
  /**
   * Name of user role required for this feature. This can be a wildcard (*)
   * if no role is required.
   */
  role: string;

  /** Title of the card */
  title: string;

  /** Description of the card */
  description: string;

  /** Relative path to the feature page */
  link: string;
}

export const FEATURE_ROUTES: Routes = [
  {
    path: 'import',
    // TODO: use RouteAccessGuard once Angular 7 is being used and UrlSegments are supported
    loadChildren: 'app/features/admin/features/import/import.module#ImportModule',
  },
];

export const FEATURES: AdminFeature[] = [
  {
    role: 'gui-admin-import',
    title: 'Import Management',
    description: 'View schedules and tasks',
    link: 'import'
  }
];
