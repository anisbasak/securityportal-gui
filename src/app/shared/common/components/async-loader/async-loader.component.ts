import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'sat-async-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content select="[satAsyncLoader]" *ngIf="!completed"></ng-content>
    <ng-content select="[satAsyncContent]" *ngIf="completed"></ng-content>
  `
})
export class SatAsyncLoaderComponent implements OnDestroy {

  /**
   * Observable stream that should subscribe and display content
   * after first emission.
   */
  @Input() set trigger(val: Observable<any>) {
    this.completed = false;
    val
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.completed = true;
        this.cd.markForCheck();
      });
  }

  /** Whether the intitial loading has completed */
  completed = false;

  /** Subject that emits when component is destroyed */
  private destroy = new Subject();

  constructor(private cd: ChangeDetectorRef) { }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
