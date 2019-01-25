import { Component, ChangeDetectorRef, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { MapsAPILoader, LatLngBounds } from '@agm/core';
declare var google;

import { Resource, Resources } from '@app/core/models';

@Component({
  selector: 'search-results-map',
  styleUrls: ['./results-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <agm-map class="map" [fitBounds]="bounds">
      <agm-marker *ngFor="let result of results"
        [latitude]="getPointCoordinateFromLoc(result, 'latitude')"
        [longitude]="getPointCoordinateFromLoc(result, 'longitude')">
      </agm-marker>
    </agm-map>

    <ng-content></ng-content>
  `
})
export class ResultsMapComponent implements OnChanges {

  /**
   * Results to be displayed on the map. It is expected that they
   * all contain location data.
   */
  @Input() results: Resources;

  /** Map bounds that contain all results. */
  bounds: LatLngBounds;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private cd: ChangeDetectorRef
  ) { }

  ngOnChanges() {
    this.updateBounds(this.results);
  }

  /** Get point coordinate from a resource's location. */
  getPointCoordinateFromLoc(result: Resource, axis: 'latitude' | 'longitude'): number {
    this.validateLocation(result.loc);
    const point = this.getPointFromLocation(result.loc);
    return axis === 'longitude' ? point.coordinates[0] : point.coordinates[1];
  }

  /** Create and store bounds derived from results. */
  private updateBounds(results: Resources): void {
    this.mapsAPILoader.load().then(() => {
      this.bounds = this.createBoundsFromResults(results);
      this.cd.markForCheck();
    });
  }

  /** Create a lat/lng bounds that contains all the results. */
  private createBoundsFromResults(results: Resources): LatLngBounds {
    const bounds = new google.maps.LatLngBounds();
    results.forEach(r => {
      bounds.extend(new google.maps.LatLng(
        this.getPointCoordinateFromLoc(r, 'latitude'),
        this.getPointCoordinateFromLoc(r, 'longitude')
      ));
    });
    return bounds;
  }

  /** Throw error if location is not available or supported. */
  private validateLocation(location: any): void {
    if (!location) {
      throw Error(
        'Resource does not have a location. Location data is required to show the ' +
        'resource on the map.'
      );
    }

    if (location.type !== 'GeometryCollection') {
      throw Error(
        'Resource location has an invalid type: ' + location.type +
        '. Only `GeometryCollection` is supported.'
      );
    }
  }

  /** Find a point geometry in the location. */
  private getPointFromLocation(location: any): any {
    // Find the first 'Point' geometry
    const point = location.geometries.find(g => g.type === 'Point');

    if (!point) {
      throw Error('No point found in location geomteries: ' + location);
    }

    return point;
  }

}
