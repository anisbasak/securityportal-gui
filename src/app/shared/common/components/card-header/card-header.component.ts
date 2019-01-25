import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Renderer2
} from '@angular/core';

type ThemePalette = 'primary' | 'accent' | 'warn' | undefined;

@Component({
  selector: 'sat-card-header',
  styleUrls: ['./card-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'sat-card-header' },
  template: `<ng-content></ng-content>`
})
export class SatCardHeaderComponent {

  private _color: ThemePalette;

  @Input()
  get color(): ThemePalette { return this._color; }
  set color(value: ThemePalette) {
    if (value !== this._color) {
      if (this._color) {
        this.renderer.removeClass(this.elementRef.nativeElement, `sat-${this._color}`);
      }
      if (value) {
        this.renderer.addClass(this.elementRef.nativeElement, `sat-${value}`);
      }

      this._color = value;
    }
  }

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) { }
}
