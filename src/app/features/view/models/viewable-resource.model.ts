import { Avatar } from '@app/core/models';

export interface ViewableResource {
  _id: string;
  blueprint: string;
  avatar: Avatar;
  name: string;
  address?: ViewableResourceAddress;
  location?: ViewableResourceLocation;
  links: ViewableResourceLink[];
  traits: ViewableResourceTrait[];
}

export interface ViewableResourceAddress {
  streets?: string[];
  poBox?: string;
  streetNumber?: string;
  suite?: string;
  city?: string;
  state?: string;
  territory?: string;
  postalCode?: string;
  country?: string;
}

export interface ViewableResourceLocation {
  latitude: number;
  longitude: number;
}

export interface ViewableResourceLink {
  rule: string;
  active: boolean;
  resourceId?: string;
  resourceName?: string;
  resourceError?: string;
}

export interface ViewableResourceTrait {
  active: boolean;
  rule: string;
  value: string;
  ts: string;
  priority: number;
  fullAssurance: boolean;
  option: string;
  meta: string;
}
