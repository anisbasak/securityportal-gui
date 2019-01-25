import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MapTypeControlOptions } from '@agm/core/services/google-maps-types';

import { ViewableResourceLocation } from '../../models';

@Component({
  selector: 'app-view-location',
  styleUrls: ['./location.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <agm-map *ngIf="centroid"
      [mapTypeControl]="true"
      [mapTypeControlOptions]="_mapTypeControlOptions"
      [latitude]="centroid.latitude"
      [longitude]="centroid.longitude"
      [zoom]="17">
      <agm-marker
        [latitude]="centroid.latitude"
        [longitude]="centroid.longitude">
      </agm-marker>
    </agm-map>
  `
})
export class ViewMapComponent {
  @Input() centroid: ViewableResourceLocation;

  _mapTypeControlOptions: MapTypeControlOptions = {
    mapTypeIds: ['roadmap', 'hybrid']
  };
}
