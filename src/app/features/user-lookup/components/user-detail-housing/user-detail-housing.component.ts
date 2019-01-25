import { Component, Input } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'app-user-detail-housing',
  styleUrls: ['./user-detail-housing.component.scss'],
  template: `
    <div *ngIf="!housing.semesterTerm">Not available</div>
    <table *ngIf="housing.semesterTerm">
      <tr>
        <td>Semester Term:</td>
        <td>{{ housing.semesterTerm || '- '}}</td>
      </tr>
      <tr>
        <td>Building Code:</td>
        <td>{{ housing.buildingCode || '- '}}</td>
      </tr>
      <tr>
        <td>Unit Bed:</td>
        <td>{{ housing.unitBed || '- '}}</td>
      </tr>
      <tr>
        <td>Unit Number:</td>
        <td>{{ housing.unitNumber || '- '}}</td>
      </tr>
      <tr>
        <td>Unit Suffix:</td>
        <td>{{ housing.unitSuffix || '- '}}</td>
      </tr>
      <tr>
        <td>Staffed in Building:</td>
        <td>{{ housing.staffedInBuilding == null ? '-' : housing.staffedInBuilding }}</td>
      </tr>
    </table>
  `
})
export class UserDetailHousingComponent {
  @Input() housing: fromModels.UserHousing;
}
