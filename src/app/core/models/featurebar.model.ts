import { NavigationExtras } from '@angular/router';

export interface FeaturebarLink {
  link: string | string[];
  label: string;
  disabled?: boolean;
}

export interface FeaturebarBack {
  enabled: boolean;
  destination?: string | string[];
  extras?: NavigationExtras;
}
