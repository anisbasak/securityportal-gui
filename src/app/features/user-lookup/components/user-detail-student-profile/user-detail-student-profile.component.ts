import { Component, Input } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'app-user-detail-student-profile',
  styleUrls: ['./user-detail-student-profile.component.scss'],
  template: `
    <div *ngIf="!studentProfiles.length">Not available</div>
    <table *ngIf="studentProfiles.length">
      <tr>
        <th>Level</th>
        <th>Enrolled</th>
        <th>Registered</th>
      </tr>
      <tr *ngFor="let profile of studentProfiles">
        <td>{{ profile.level }}</td>
        <td>{{ profile.enrolled }}</td>
        <td>
          <span *ngIf="profile.registeredDate">{{ profile.registeredDate | date: 'medium' }}</span>
          <span *ngIf="!profile.registeredDate">-</span>
        </td>
      </tr>
    </table>
  `
})
export class UserDetailStudentProfileComponent {
  @Input() studentProfiles: fromModels.UserStudentProfile[];
}
