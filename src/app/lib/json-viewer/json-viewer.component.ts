// Adapted from https://github.com/temich666/t-json-viewer
import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';

interface Item {
  key: string;
  value: any;
  title: string;
  type: string;
  opened: boolean;
}

@Component({
  selector: 'sat-json-viewer',
  styleUrls: ['./json-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngFor="let item of items" [ngClass]="['item', 'item__type--' + item.type]">

      <!-- Title -->
      <div class="item__title" (click)="toggleItemOpened(item)">
        <div class="toggler" *ngIf="isObject(item)" [class.opened]="item.opened"></div>
        <span class="item__key">{{ item.key }}</span>
        <span class="item__colon">:</span>
        <span class="item__value" *ngIf="!item.opened">{{ item.title }}</span>
      </div>

      <!-- Child viewer -->
      <sat-json-viewer *ngIf="item.opened && isObject(item)" [json]="item.value"></sat-json-viewer>
    </div>
  `
})
export class SatJsonViewerComponent implements OnInit {

  /** JSON object to display. */
  @Input() json: any[] | Object | any;

  /** List of items. */
  items: Item[] = [];

  ngOnInit() {
    // Do nothing without data
    if (!['object', 'array'].includes(typeof this.json)) {
      return;
    }

    // Convert json to array of items
    this.items = Object.keys(this.json)
      .map(key => this.createItem(key, this.json[key]));
  }

  /** Check item's type for Array or Object. */
  isObject(item: Item): boolean {
    return ['object', 'array'].includes(item.type);
  }

  /** Toggle a collapsable item open/closed. */
  toggleItemOpened(item: Item) {
    if (!this.isObject(item)) {
      return;
    }
    item.opened = !item.opened;
  }

  /** Check value and create item object. */
  private createItem(key: string, value: any): Item {
    const item: Item = {
      key: key || '""',
      value: value,
      title: value,
      type: undefined,
      opened: false
    };

    if (typeof (item.value) === 'string') {
      item.type = 'string';
      item.title = `"${item.value}"`;
    } else if (typeof (item.value) === 'number') {
      item.type = 'number';
    } else if (typeof (item.value) === 'boolean') {
      item.type = 'boolean';
    } else if (item.value instanceof Date) {
      item.type = 'date';
    } else if (typeof (item.value) === 'function') {
      item.type = 'function';
    } else if (Array.isArray(item.value)) {
      item.type = 'array';
      item.title = item.value.length ? '[{...}]' : '[]';
    } else if (item.value === null) {
      item.type = 'null';
      item.title = 'null';
    } else if (typeof (item.value) === 'object') {
      item.type = 'object';
      const asStr = JSON.stringify(item.value);
      item.title = asStr.replace(/"(\w+)"\s*:/g, '$1:');
    } else if (item.value === undefined) {
      item.type = 'undefined';
      item.title = 'undefined';
    }

    item.title = '' + item.title; // defined type or 'undefined'

    return item;
  }

}

