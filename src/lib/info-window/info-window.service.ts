import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface IInfoWindow {
  title?: string;
  content: string | TemplateRef<any>;
  actions?: TemplateRef<any>;
  actionTypes?: 'ok'|'yesNo'|'close';
}

/**
 * This service can be used to display a dialog window with the Label Designer component.
 *
 * @example
 * <ng-template #action>
 *    <button (click)="doYes()" class="btn btn-default btn-sm pull-right">Yes</button>
 * </ng-template>
 *
 * (at)ViewChild('action', { static: true }) action: TemplateRef<any>;
 * infoWindowService.open({title: 'dialog', content: 'Are you sure that you want to do that?', actions: this.action});
 *
 * function doYes() {
 *   infoWindowService.close(true);
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class InfoWindowService {

  private visibilitySource = new BehaviorSubject<boolean>(false);
  private dataSource = new BehaviorSubject<IInfoWindow>({content: '', actionTypes: 'ok'});
  private closeSubject: Subject<any>;

  /**
   * Opens the dialog window with an observable for the close value
   */
  open(data: IInfoWindow): Observable<any> {
    this.dataSource.next(data);
    this.visibilitySource.next(true);
    this.closeSubject = new Subject();
    return this.closeSubject.asObservable();
  }

  /**
   * Closes the dialog and sends the closing value to the observable that was returned when the dialog was opened.
   */
  close(value?: any) {
    this.closeSubject.next(value);
    this.visibilitySource.next(false);
  }

  /**
   * @internal
   */
  visibilityAsObservable() {
    return this.visibilitySource.asObservable();
  }

  /**
   * @internal
   */
  dataAsObservable() {
    return this.dataSource.asObservable();
  }
}
