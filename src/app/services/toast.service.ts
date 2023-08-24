import { Injectable, inject } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toast = inject(HotToastService);

  showLoader(message: string) {
    this.toast.loading(message, { id: 'loader' });
  }

  hideLoader() {
    this.toast.close('loader');
  }

  showSuccess(message: string) {
    this.toast.success(message);
  }

  showError(message: string) {
    this.toast.error(message);
  }
}
