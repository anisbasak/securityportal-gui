/** Describes a map coordinate and radius or zoom level. */
export interface MapCoordinate {
  /** Latitude */
  lat: number;

  /** Longitude */
  lng: number;

  /** Zoom level (optional) */
  zoom?: number;

  /** Radius in meters (optional) */
  radius?: number;
}
