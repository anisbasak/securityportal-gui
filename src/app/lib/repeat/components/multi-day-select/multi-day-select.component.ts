import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output
} from '@angular/core';


@Component({
  selector: 'multi-day-select',
  styleUrls: ['./multi-day-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-button-toggle-group multiple
      class="mat-elevation-z0"
      [class.disabled]="disabled"
      [disabled]="disabled"
      [ngClass]="extraClass">
      <mat-button-toggle
        *ngFor="let option of options; let i=index;"
        [value]="option"
        [disabled]="isDisabled(i)"
        [checked]="isSelected(i)"
        (change)="select.emit(i)">
        {{ option }}
      </mat-button-toggle>
    </mat-button-toggle-group>
  `
})
export class MultiDaySelectComponent {

  /** Whether the select group is disabled */
  @Input() disabled: boolean;

  /** Whether the select group prevents deselecting the last item */
  @Input() preventNone = false;

  /** Extra class to be added to the button toggle group */
  @Input() extraClass;

  /** Array of options for the multi select. Strings will be displayed as labels */
  @Input() options: string[];

  /** Array of indicies that have been selected. Indicies refer to options array */
  @Input() selectedIndicies: number[];

  /** Emits the index of an item that has been selected/deselected */
  @Output() select = new EventEmitter<number>();

  /** Whether the index is in the array of selected indicies */
  isSelected(index: number) {
    return this.selectedIndicies.includes(index);
  }

  /** When preventNone is true, the last remaining checkbox will be disabled */
  isDisabled(index: number) {
    return this.preventNone
      && this.selectedIndicies.length === 1
      && this.selectedIndicies[0] === index;
  }
}
