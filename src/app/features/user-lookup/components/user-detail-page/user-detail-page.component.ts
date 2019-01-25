import { Component, Input } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'app-user-detail-page',
  styleUrls: ['./user-detail-page.component.scss'],
  template: `
    <ng-container *ngIf="user">
      <!-- Hero -->
      <app-user-detail-hero class="user-detail-hero" [user]="user"></app-user-detail-hero>

      <!-- Contact -->
      <div class="mat-title">Contact Information</div>
      <mat-card>
        <app-user-detail-contact [contact]="user.contact"></app-user-detail-contact>
      </mat-card>

      <!-- Organization -->
      <div class="mat-title">Organization</div>
      <mat-card>
        <app-user-detail-organization [organization]="user.organization"></app-user-detail-organization>
      </mat-card>

      <!-- Employment -->
      <div class="mat-title">Employment</div>
      <mat-card>
        <app-user-detail-employment [employments]="user.employment" [linkUsers]="linkUsers"></app-user-detail-employment>
      </mat-card>

      <!-- Direct Reports -->
      <div class="mat-title">Direct Reports</div>
      <mat-card>
        <app-user-detail-direct-reports [directReports]="user.directReports" [linkUsers]="linkUsers"></app-user-detail-direct-reports>
      </mat-card>

      <!-- WolfOne -->
      <div class="mat-title">WolfOne</div>
      <mat-card>
        <app-user-detail-wolfone [wolfone]="user.wolfOne"></app-user-detail-wolfone>
      </mat-card>

      <!-- CCURE -->
      <div class="mat-title">CCURE</div>
      <mat-card>
        <app-user-detail-ccure [ccure]="user.ccure"></app-user-detail-ccure>
      </mat-card>

      <!-- Student Profile -->
      <div class="mat-title">Student Profile</div>
      <mat-card>
        <app-user-detail-student-profile [studentProfiles]="user.studentProfiles"></app-user-detail-student-profile>
      </mat-card>

      <!-- Housing -->
      <div class="mat-title">Housing</div>
      <mat-card>
        <app-user-detail-housing [housing]="user.housing"></app-user-detail-housing>
      </mat-card>

      <!-- Extra information for super users -->
      <ng-container *ngIf="superUser">
        <div class="mat-title">Admin</div>
        <p>
          <a [routerLink]="['/view', user._id]">id: {{ user._id }}</a>
        </p>
      </ng-container>

    </ng-container>

  `
})
export class UserDetailPageComponent {
  @Input() user: fromModels.User;
  @Input() superUser: boolean;

  // TODO: remove the need for this toggle
  @Input() linkUsers = true;
}
