import { Component, Input } from '@angular/core';

/**
 * @internal
 */
@Component({
  selector: 'll-loader',
  template: `
      <div *ngIf="loading" class="ll-loader">
          <div></div>
          <div></div>
          <div></div>
      </div>`,
  styles: [`
      .ll-loader {
          display: inline-block;
          position: relative;
          width: 27px;
          height: 27px;
      }

      .ll-loader div {
          display: inline-block;
          position: absolute;
          left: 3px;
          width: 4px;
          background: #333;
          animation: ll-loader 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
      }

      .ll-loader div:nth-child(1) {
          left: 4px;
          animation-delay: -0.24s;
      }

      .ll-loader div:nth-child(2) {
          left: 10px;
          animation-delay: -0.12s;
      }

      .ll-loader div:nth-child(3) {
          left: 16px;
      }

      @keyframes ll-loader {
          0% {
              top: 3px;
              height: 25px;
          }
          50%, 100% {
              top: 9px;
              height: 13px;
          }
      }
  `]
})
export class LoaderComponent {
  @Input() loading = false;

}
