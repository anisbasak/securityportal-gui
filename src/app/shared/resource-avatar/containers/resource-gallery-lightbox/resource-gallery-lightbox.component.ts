import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import { Subject } from 'rxjs';
import { takeUntil, tap, take } from 'rxjs/operators';

import { getImageSrc } from '@app/core/util';
import * as fromModels from '../../models';

@Component({
  selector: 'resource-gallery-lightbox',
  styleUrls: ['./resource-gallery-lightbox.component.scss'],
  template: `
    <img class="image" [src]="getImageSrc()">

    <p class="caption">{{ getImageName() }} - {{ getLocation() }}</p>
    <button mat-icon-button *ngIf="_showNav" class="nav--prev" [disabled]="!hasPrev()" (click)="prev()">
      <mat-icon>arrow_back</mat-icon>
    </button>
    <button mat-icon-button *ngIf="_showNav" class="nav--next" [disabled]="!hasNext()" (click)="next()">
      <mat-icon>arrow_forward</mat-icon>
    </button>
    <button mat-icon-button mat-dialog-close *ngIf="_showNav" class="nav--exit">
      <mat-icon>close</mat-icon>
    </button>
  `
})
export class ResourceGalleryLightboxComponent implements OnInit, OnDestroy {
  _images: fromModels.GalleryImage[] = [];
  _index = 0;
  _showNav = false;

  private _onDestroy = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) data: fromModels.GalleryLightboxData,
    private dialogRef: MatDialogRef<ResourceGalleryLightboxComponent>
  ) {
    this._images = data.images;
    this._index = data.index || 0;
  }

  ngOnInit() {
    this.dialogRef.keydownEvents().pipe(
      tap(e => {
        if ([DOWN_ARROW, RIGHT_ARROW].includes(e.keyCode)) {
          this.next();
          e.preventDefault();
        }

        if ([LEFT_ARROW, UP_ARROW].includes(e.keyCode)) {
          this.prev();
          e.preventDefault();
        }
      }),
      takeUntil(this._onDestroy),
    ).subscribe();

    this.dialogRef.afterOpen().pipe(
      take(1),
      tap(() => this._showNav = true),
      takeUntil(this._onDestroy),
    ).subscribe();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  hasNext() {
    return this._index + 1 < this._images.length;
  }

  hasPrev() {
    return this._index - 1 > -1;
  }

  next() {
    if (this.hasNext()) {
      this._index++;
    }
  }

  prev() {
    if (this.hasPrev()) {
      this._index--;
    }
  }

  getLocation() {
    const loc = this._index + 1;
    const total = this._images.length;
    return `${loc}/${total}`;
  }

  getImageSrc() {
    const image = this._getImage();
    return image ? getImageSrc(image.md5) : null;
  }

  getImageName() {
    const image = this._getImage();
    return image ? image.name : null;
  }

  private _getImage() {
    const i = this._index;
    if (i > -1 && i < this._images.length) {
      return this._images[i];
    }
  }

}
