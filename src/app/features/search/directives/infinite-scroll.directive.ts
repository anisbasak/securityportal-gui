import { Directive, Input, Output, OnInit, OnDestroy, EventEmitter, ElementRef } from '@angular/core';
import { interval, fromEvent, Subject, merge } from 'rxjs';
import { takeUntil, filter, map, sampleTime } from 'rxjs/operators';

@Directive({
  selector: '[infiniteScroll]'
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {

  /** Selector for the scroll container. */
  @Input() infiniteScrollContainer: string;

  /** Trigger point in px from the bottom of the container. */
  @Input() infiniteScrollBottomTrigger = 500;

  /** Trigger timer in milliseconds. */
  @Input() infiniteScrollBackgroundTimer = 1000;

  /** Scroll sample time. */
  @Input() infiniteScrollSampleTime = 50;

  /** Emits when the user has scrolled past the trigger point. */
  @Output() scrolledPastTrigger = new EventEmitter<void>();

  /** Emits when the directive is destroyed. */
  private destroy = new Subject<void>();

  constructor(private element: ElementRef) { }

  ngOnInit() {
    // Capture scroll container element
    const scrollContainer = this.infiniteScrollContainer
      ? document.querySelector(this.infiniteScrollContainer)
      : window;

    // Fires whenever the container is scrolled
    const scroll$ = fromEvent(scrollContainer, 'scroll')
      .pipe(sampleTime(this.infiniteScrollSampleTime));

    // Fires at a given interval. This is useful for instances where the first page does not
    // require scrolling to display
    const timer$ = interval(this.infiniteScrollBackgroundTimer);

    merge(scroll$, timer$)
      .pipe(
        map(() => this.getDistanceFromBottom()),
        filter(distance => distance <= this.infiniteScrollBottomTrigger),
        takeUntil(this.destroy),
      )
      .subscribe(() => this.scrolledPastTrigger.emit());
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  /** Returns the difference between the container bottom and the window bottom. */
  private getDistanceFromBottom(): number {
    return this.element.nativeElement.getBoundingClientRect().bottom - window.innerHeight;
  }
}
