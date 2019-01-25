import { Injectable } from '@angular/core';


@Injectable()
export class LoadingService {
  private id = 0;

  getNextId(): number {
    return this.id++;
  }
}
