import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private readonly _activeRequests = signal(0);

  get isVisible() {
    return this._activeRequests() > 0;
  }

  show() {
    this._activeRequests.update((count) => count + 1);
  }

  hide() {
    this._activeRequests.update((count) => Math.max(count - 1, 0));
  }
}
