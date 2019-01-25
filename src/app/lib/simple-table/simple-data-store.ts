import { Observable, BehaviorSubject } from 'rxjs';
import { skip } from 'rxjs/operators';

export class SimpleDataStore<T> {

  data: Observable<T[]>;

  private store$ = new BehaviorSubject<T[]>([]);

  constructor() {
    this.data = this.store$.asObservable().pipe(skip(1));
  }

  get value(): T[] {
    return this.store$.value;
  }

  set(values: T[]) {
    this.store$.next(values);
  }

}
