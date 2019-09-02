import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

/**
 * @ignore
 */
interface IState {
  currentFile: string;
  hasChanges: boolean;
}

/**
 * @ignore
 */
let _state: IState = {
  currentFile: '',
  hasChanges: false
};

/**
 * @internal
 */
export class LabelMakerFacade {

  private store  = new BehaviorSubject<IState>(_state);
  state$ = this.store.asObservable();

  hasChanges$ = this.state$.pipe(map(state => state.hasChanges), distinctUntilChanged());
  currentFile$ = this.state$.pipe(map(state => state.currentFile), distinctUntilChanged());

  loadedFile(filename: string) {
    this.updateState({..._state, currentFile: filename, hasChanges: false});
  }

  hasChanges(changes: boolean) {
    this.updateState({..._state, hasChanges: changes});
  }

  private updateState(state: IState) {
    this.store.next(_state = state);
  }
}
