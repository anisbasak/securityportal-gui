import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs';

export class SimpleDataSource<T> extends DataSource<T> {

  constructor(private dataStream: Observable<T[]>) {
    super();
  }

  connect(): Observable<T[]> {
    return this.dataStream;
  }

  /** Noop */
  disconnect() {}
}
