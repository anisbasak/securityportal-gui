import { Injectable } from '@angular/core';

export enum State {
  SEARCH_COMPONENT
}

/**
 * TODO: obsolete this with redux
 */
@Injectable()
export class PersistenceService {

  private stateStore = {};

  registerStateKey(key: State) {
    this.stateStore[key] = this.stateStore[key] || {};
  }

  setState(key: State, state: any) {
    this.stateStore[key] = state;
  }

  getState(key: State): any {
    return this.stateStore[key];
  }

  clearState(key: State): any {
    this.stateStore[key] = undefined;
  }

}
