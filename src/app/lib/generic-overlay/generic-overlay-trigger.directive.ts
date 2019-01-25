import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewContainerRef
} from '@angular/core';
import {
  ConnectedPositionStrategy,
  HorizontalConnectionPos,
  Overlay,
  OverlayRef,
  OverlayConfig,
  VerticalConnectionPos
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SatGenericOverlayComponent, OverlayPositionX, OverlayPositionY } from './generic-overlay.component';

// Override lint because this is a non-standard directive
/* tslint:disable:directive-class-suffix no-input-rename */

@Directive({
  selector: '[satGenericOverlayTriggerFor]'
})
export class SatGenericOverlayTrigger implements AfterViewInit, OnDestroy {

  /** References the associated generic overlay instance. */
  @Input('satGenericOverlayTriggerFor') genericOverlay: SatGenericOverlayComponent;

  /** Whether clicking the target element will automatically toggle the element. */
  @Input('satToggleOnClick') toggleOnClick = true;

  /** Event emitted when the generic overlay is opened. */
  @Output() onGenericOverlayOpen = new EventEmitter<void>();

  /** Event emitted when the generic overlay is closed. */
  @Output() onGenericOverlayClose = new EventEmitter<any>();

  /** Whether the generic overlay is presently open. */
  genericOverlayOpen = false;

  /** Reference to a template portal where the overlay will be attached. */
  private portal: TemplatePortal<any>;

  /** Reference to the overlay containing the generic overlay component. */
  private overlayRef: OverlayRef;

  /** Emits when the component is destroyed. */
  private destroy = new Subject<void>();

  constructor(
    private overlay: Overlay,
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngAfterViewInit() {
    this.checkIsGenericOverlay();
    this.genericOverlay.close.pipe(
      takeUntil(this.destroy)
    ).subscribe(() => this.closeGenericOverlay());
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();

    this.destroyGenericOverlay();
  }

  /** Toggle the generic overlay when element is clicked */
  @HostListener('click')
  triggerClicked(): void {
    if (this.toggleOnClick) {
      this.toggleGenericOverlay();
    }
  }

  /** Toggles the generic overlay between the open and closed states. */
  toggleGenericOverlay(): void {
    return this.genericOverlayOpen ? this.closeGenericOverlay() : this.openGenericOverlay();
  }

  /** Opens the generic overlay. */
  openGenericOverlay(): void {
    if (!this.genericOverlayOpen) {
      this.createOverlay();
      this.overlayRef.attach(this.portal);
      this.subscribeToBackdrop();

      // Save and emit
      this.genericOverlayOpen = true;
      this.onGenericOverlayOpen.emit();
    }
  }

  /** Closes the generic overlay. */
  closeGenericOverlay(value?: any): void {
    if (this.overlayRef) {
      this.overlayRef.detach();

      // Save and emit
      this.genericOverlayOpen = false;
      value === undefined
        ? this.onGenericOverlayClose.emit()
        : this.onGenericOverlayClose.emit(value);
    }
  }

  /** Removes the generic overlay from the DOM. */
  destroyGenericOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  /** Throws an error if the generic overlay instance is not provided. */
  private checkIsGenericOverlay(): void {
    if (!this.genericOverlay) {
      throw new Error('satGenericOverlayTriggerFor: must pass in a generic overlay instance');
    }
  }

  /** Emit close event when backdrop is clicked for as long as overlay is open. */
  private subscribeToBackdrop(): void {
    this.overlayRef
      .backdropClick()
      .pipe(
        takeUntil(this.onGenericOverlayClose),
        takeUntil(this.destroy),
      )
      .subscribe(() => this.genericOverlay.emitCloseEvent());
  }

  /** Create an overlay to be attached to the portal. */
  private createOverlay(): void {
    if (!this.overlayRef) {
      this.portal = new TemplatePortal(this.genericOverlay.templateRef, this.viewContainerRef);
      const config = this.getOverlayConfig();
      this.subscribeToPositionChanges(config.positionStrategy as ConnectedPositionStrategy);
      this.overlayRef = this.overlay.create(config);
    }
  }

  /** Create and return a config for creating the overlay. */
  private getOverlayConfig(): OverlayConfig {
    const overlayConfig = new OverlayConfig();
    overlayConfig.positionStrategy = this.getPosition();
    overlayConfig.hasBackdrop = true;
    overlayConfig.backdropClass = 'cdk-overlay-transparent-backdrop';
    overlayConfig.scrollStrategy = this.overlay.scrollStrategies.reposition();

    return overlayConfig;
  }

  /**
   * Listen to changes in the position of the overlay and set the correct classes,
   * ensuring that the animation origin is correct, even with a fallback position.
   */
  private subscribeToPositionChanges(position: ConnectedPositionStrategy): void {
    position.onPositionChange
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe(change => {
        const posX = convertFromHorizontalPos(change.connectionPair.overlayX, true);
        const posY = convertFromVerticalPos(change.connectionPair.overlayY, true);
        this.genericOverlay.setPositionClasses(posX, posY);
      });
  }

  /** Create and return a position strategy based on config provided to the component instance. */
  private getPosition(): ConnectedPositionStrategy {
    // Get config values from the generic overlay
    const overlap = this.genericOverlay.overlapTrigger;
    const xPos = this.genericOverlay.xPosition;
    const yPos = this.genericOverlay.yPosition;

    // Convert position to value usable by strategy. Invert for the overlay so that 'above' means
    // the overlay is attached at the 'bottom'
    const overlayX = convertToHorizontalPos(xPos, true);
    const overlayY = convertToVerticalPos(yPos, true);

    // Invert for the trigger when overlapping. When it isn't supposed to overlap, use the original
    // translation so that 'above' means 'top'
    const originX = convertToHorizontalPos(xPos, overlap);
    const originY = convertToVerticalPos(yPos, overlap);

    // Generate a position strategy with iterative fall back solutions
    //       1 2 3
    //  ↖︎ => 4 5 6
    //       7 8 9
    return this.overlay.position()
      // Original Y position (1)
      .connectedTo(this.elementRef,
        {originX: originX, originY: originY},
        {overlayX: overlayX, overlayY: overlayY}
      )
      // (2)
      .withFallbackPosition(
        {originX: 'center', originY: originY},
        {overlayX: 'center', overlayY: overlayY}
      )
      // (3)
      .withFallbackPosition(
        {originX: reverseHorizontal(originX), originY: originY},
        {overlayX: reverseHorizontal(overlayX), overlayY: overlayY},
      )
      // Center Y position (4)
      .withFallbackPosition(
        {originX: originX, originY: 'center'},
        {overlayX: overlayX, overlayY: 'center'}
      )
      // (5)
      .withFallbackPosition(
        {originX: 'center', originY: 'center'},
        {overlayX: 'center', overlayY: 'center'}
      )
      // (6)
      .withFallbackPosition(
        {originX: reverseHorizontal(originX), originY: 'center'},
        {overlayX: reverseHorizontal(overlayX), overlayY: 'center'},
      )
      // Reverse Y position (7)
      .withFallbackPosition(
        {originX: originX, originY: reverseVertical(originY)},
        {overlayX: overlayX, overlayY: reverseVertical(overlayY)}
      )
      // (8)
      .withFallbackPosition(
        {originX: 'center', originY: reverseVertical(originY)},
        {overlayX: 'center', overlayY: reverseVertical(overlayY)}
      )
      // (9)
      .withFallbackPosition(
        {originX: reverseHorizontal(originX), originY: reverseVertical(originY)},
        {overlayX: reverseHorizontal(overlayX), overlayY: reverseVertical(overlayY)}
      );
  }

}

/** Helper to convert to correct horizontal position */
function convertToHorizontalPos(val: OverlayPositionX, invert?: boolean): HorizontalConnectionPos {
  switch (val) {
    case 'before':
      return invert ? 'end' : 'start';
    case 'center':
      return 'center';
    case 'after':
      return invert ? 'start' : 'end';
  }
}

/** Helper to convert from a horizontal position back to an overlay position  */
function convertFromHorizontalPos(val: HorizontalConnectionPos, invert?: boolean): OverlayPositionX {
  switch (val) {
    case 'start':
      return invert ? 'after' : 'before';
    case 'center':
      return 'center';
    case 'end':
      return invert ? 'before' : 'after';
  }
}

/** Helper to convert to correct vertical position */
function convertToVerticalPos(val: OverlayPositionY, invert?: boolean): VerticalConnectionPos {
  switch (val) {
    case 'above':
      return invert ? 'bottom' : 'top';
    case 'center':
      return 'center';
    case 'below':
      return invert ? 'top' : 'bottom';
  }
}

/** Helper to convert from a vertical position back to an overlay position */
function convertFromVerticalPos(val: VerticalConnectionPos, invert?: boolean): OverlayPositionY {
  switch (val) {
    case 'top':
      return invert ? 'below' : 'above';
    case 'center':
      return 'center';
    case 'bottom':
      return invert ? 'above' : 'below';
  }
}

/** Helper to reverse horizontal position */
function reverseHorizontal(val: HorizontalConnectionPos): HorizontalConnectionPos {
  switch (val) {
    case 'start':
      return 'end';
    case 'end':
      return 'start';
    default:
      return 'center';
  }
}

/** Helper to reverse vertical position */
function reverseVertical(val: VerticalConnectionPos): VerticalConnectionPos {
  switch (val) {
    case 'top':
      return 'bottom';
    case 'bottom':
      return 'top';
    default:
      return 'center';
  }
}

