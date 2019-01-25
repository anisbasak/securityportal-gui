import {
  Inject,
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AgmCircle, LatLngLiteral, LatLngBounds } from '@agm/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LocationSearch, MapCoordinate } from '../../models';
import { MAP_DEFAULTS } from '../../constants';

@Component({
  // Entry component only. No selector needed.
  styleUrls: ['./map-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Map -->
    <agm-map class="map"
      *ngIf="showMap"
      [streetViewControl]="false"
      [clickableIcons]="false"
      [fitBounds]="bounds"
      [longitude]="initialMapCoord?.lng"
      [latitude]="initialMapCoord?.lat"
      [zoom]="initialMapCoord?.zoom">
      <agm-circle
        [longitude]="initialCircleCoord.lng"
        [latitude]="initialCircleCoord.lat"
        [radius]="initialCircleCoord.radius"
        [draggable]="true"
        [editable]="true"
        (centerChange)="selectCoordinates($event)"
        (radiusChange)="selectRadius($event)">
      </agm-circle>
    </agm-map>

    <!-- Close button -->
    <button mat-mini-fab
      color="primary"
      class="button"
      (click)="close()">
      <mat-icon>done</mat-icon>
    </button>
  `
})
export class MapDialogComponent implements OnDestroy {

  /** Bounds of the map. */
  bounds: LatLngBounds = null;

  /** Initial coordinates of the map view. */
  initialMapCoord: MapCoordinate;

  /** Initial coordinates of the circle selector. */
  initialCircleCoord: MapCoordinate;

  /**
   * Whether the map component should be shown. It is lazily
   * displayed to avoid adding jank to the dialog animation.
   */
  showMap = false;

  /** Reference to the AGM circle selector. */
  @ViewChild(AgmCircle) private circle: AgmCircle;

  /** Coordinates selected by the user. */
  private selectedCoord: MapCoordinate;

  /** Emits when the component is destroyed. */
  private destroy = new Subject<void>();

  constructor (
    private dialogRef: MatDialogRef<MapDialogComponent>,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) data: LocationSearch
  ) {
    this.initializeState(data);
    this.dialogRef.afterOpen()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        // TODO: remove promise when afterOpen no longer emits
        // when dialog opening is canceled
        Promise.resolve().then(() => {
          this.showMap = true;
          this.cd.markForCheck();
        });
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  /** Select the lat/long pair. */
  selectCoordinates(coordinates: LatLngLiteral): void {
    this.selectedCoord.lat = coordinates.lat;
    this.selectedCoord.lng = coordinates.lng;
  }

  /** Select the radius. */
  selectRadius(radius: number): void {
    this.selectedCoord.radius = radius;
  }

  /** Close the dialog with the current selection. */
  close(): void {
    if (this.circle) {
      this.circle.getBounds().then(bounds => {
        const constructedSearch: LocationSearch = {
          point: [this.selectedCoord.lng, this.selectedCoord.lat],
          max: this.selectedCoord.radius,
          min: 0,
          meta: { bounds: bounds }
        };
        this.dialogRef.close(constructedSearch);
      });
    } else {
      this.dialogRef.close();
    }
  }

  /**
   * Initialize the coordinates for the map and controls.
   * Note that data may be null if the map is being created initially.
   */
  private initializeState(data: LocationSearch) {
    // Initialize the map bounds and zoom level
    if (data && data.meta && data.meta.bounds) {
      // Use specific bounds if they're available
      this.bounds = data.meta.bounds;
    } else if (data) {
      // Fallback to setting the lat/long/zoom when available
      this.initialMapCoord = {
        lng: data.point[0],
        lat: data.point[1],
        zoom: MAP_DEFAULTS.zoom
      };
    } else {
      // Fallback to default location and zoom
      this.initialMapCoord = {
        lng: MAP_DEFAULTS.longitude,
        lat: MAP_DEFAULTS.latitude,
        zoom: MAP_DEFAULTS.zoom
      };
    }

    // Set the control coordinates
    if (data) {
      // Use existing coordinates if available
      this.initialCircleCoord = {
        lng: data.point[0],
        lat: data.point[1],
        radius: data.max
      };
    }  else {
      // Fallback to default location and default radius
      this.initialCircleCoord = {
        lng: MAP_DEFAULTS.longitude,
        lat: MAP_DEFAULTS.latitude,
        radius: 50
      };
    }

    // Select the initial values via shallow copy
    this.selectedCoord = Object.assign({}, this.initialCircleCoord);
  }
}
