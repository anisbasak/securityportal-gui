import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'sp-menu',
  styleUrls: ['menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav>
      <ng-container *ngFor="let object of menu; let i = index;">

        <!-- First item object -->
        <mat-nav-list dense *ngIf="object.type === 'item' && i === 0" class="first">
          <a mat-list-item
            [routerLink]="[object.data?.path]"
            routerLinkActive="selected">
            <mat-icon mat-list-icon>{{ object.data?.icon }}</mat-icon>
            <div matLine>{{ object.data?.title }}</div>
          </a>
        </mat-nav-list>

        <!-- Item object -->
        <mat-nav-list dense *ngIf="object.type === 'item' && i !== 0">
         <a mat-list-item
            [routerLink]="[object.data?.path]"
            routerLinkActive="selected">
            <mat-icon mat-list-icon>{{ object.data?.icon }}</mat-icon>
            <div matLine>{{ object.data?.title }}</div>
          </a>
        </mat-nav-list>

        <!-- Header object -->
        <ng-container *ngIf="object.type === 'header'">
          <div class="header caption">{{ object.data?.title }}</div>
          <mat-nav-list dense>
            <a mat-list-item *ngFor="let child of object.data?.children"
              [routerLink]="[child.path]"
              routerLinkActive="selected">
              <mat-icon mat-list-icon>{{ child.icon }}</mat-icon>
              <div matLine>{{ child.title }}</div>
            </a>
          </mat-nav-list>
        </ng-container>

      </ng-container>
    </nav>
  `
})
export class MenuComponent {
  @Input() menu: fromModels.MenuObject[];
}
