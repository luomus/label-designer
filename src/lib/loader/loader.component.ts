import { Component, Input } from '@angular/core';

/**
 * @internal
 */
@Component({
  selector: 'll-loader',
  template: `<div *ngIf="loading" class="ll-ellipsis"><div></div><div></div><div></div><div></div></div>`,
  styles: [`
    .ll-ellipsis {
      display: inline-block;
      position: relative;
      width: 32px;
      height: 15px;
    }
    .ll-ellipsis div {
      position: absolute;
      top: 13px;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #333;
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    .ll-ellipsis div:nth-child(1) {
      left: 3px;
      animation: ll-ellipsis1 0.6s infinite;
    }
    .ll-ellipsis div:nth-child(2) {
      left: 3px;
      animation: ll-ellipsis2 0.6s infinite;
    }
    .ll-ellipsis div:nth-child(3) {
      left: 13px;
      animation: ll-ellipsis2 0.6s infinite;
    }
    .ll-ellipsis div:nth-child(4) {
      left: 22px;
      animation: ll-ellipsis3 0.6s infinite;
    }
    @keyframes ll-ellipsis1 {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes ll-ellipsis3 {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }
    @keyframes ll-ellipsis2 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(9px, 0);
      }
    }

  `]
})
export class LoaderComponent {
  @Input() loading = false;

}
