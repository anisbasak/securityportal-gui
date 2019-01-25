export type Resources = Resource[];

export interface Resource {
  _id: string;
  name: string;
  blueprint: string;
  state: string;
  traits: Trait[];
  loc: ResourceLocation;
  avatar: null | Avatar;
  permit: Permit;

  // TODO(applet): properties that may be tacked onto the resource model
  // in the api. this should be phased out with the new
  // applet concept
  score?: number;
  distance?: number;
}

export interface Trait {
  rule: string;
  value: any;
  text: string | null;
  state: TraitState;
  option: string | null;
  meta: { [key: string]: string } | null;
  priority: number;
  ts: Date;
}

export type TraitState = 'Active' | 'Archived' | 'Replaced';

export interface TraitOption {
  field: string;
  value: string;
}

export interface ResourceLocation {
  type: 'GeometryCollection';
  geometries: GeoJSON[];
}

export type GeoType = 'LineString' | 'MultiLineString' | 'MultiPoint' | 'MultiPolygon' | 'Point' | 'Polygon';

export interface GeoJSON {
  type: GeoType;
  coordinates: any[];
}

export interface Avatar {
  original: string | null;
  tiny: string | null;
  small: string | null;
  medium: string | null;
  large: string | null;
}

export interface Permit {
  read: string;
  owner: string;
}
