import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LatLngBounds } from '@agm/core';

import { STANDARD_NO_LABEL, DARK_NO_LABEL } from '../../constants';
import { LocationSearch, MapCoordinate } from '../../models';

type MiniMapStyle = 'light' | 'dark';

@Component({
  selector: 'form-mini-map',
  styleUrls: ['./form-mini-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <agm-map class="map"
      [mapDraggable]="false"
      [disableDoubleClickZoom]="true"
      [disableDefaultUI]="true"
      [scrollwheel]="false"
      [keyboardShortcuts]="false"
      [zoomControl]="false"
      [streetViewControl]="false"
      [gestureHandling]="'none'"
      [clickableIcons]="false"
      [styles]="_mapStyle"
      [fitBounds]="_bounds">
      <agm-circle
        [fillColor]="_targetColor"
        [latitude]="_coord.lat"
        [longitude]="_coord.lng"
        [radius]="_coord.radius">
      </agm-circle>
    </agm-map>
    <div class="actions" [class.dark]="_style === 'dark'">
      <mat-icon title="Edit" (click)="edit.emit()">edit</mat-icon>
      <mat-icon title="Remove" (click)="remove.emit()">remove_circle</mat-icon>
    </div>
  `
})
export class FormMiniMapComponent {

  /** Which style mode the map should display in. */
  @Input() set style(val: MiniMapStyle) {
    this._style = val;
    this._mapStyle = val === 'dark' ? DARK_NO_LABEL : STANDARD_NO_LABEL;
  }
  _style: MiniMapStyle = 'light';

  /** Search data to be visualized. */
  @Input() set search(val: LocationSearch) {
    this._bounds = val.meta.bounds;

    this._coord = {
      lng: val.point[0],
      lat: val.point[1],
      radius: val.max
    };
  }

  /** Emits when the map search should be edited. */
  @Output() edit = new EventEmitter<void>();

  /** Emits when the map search should be removed. */
  @Output() remove = new EventEmitter<void>();

  /** Coordinates for the radius target. Derived from the search data. */
  _coord: MapCoordinate;

  /** Bounds of the map. Derived from the search data. */
  _bounds: LatLngBounds;

  /** The style of the map. Derived from the MiniMapStyle. */
  _mapStyle: any[] = STANDARD_NO_LABEL;

  /** The color of the radius target. */
  _targetColor = '#D32F2F';

}
