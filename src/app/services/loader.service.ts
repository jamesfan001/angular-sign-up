import { Injectable, inject } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  toast = inject(HotToastService);

  show(message: string) {
    this.toast.loading(message, { id: 'loader' });
  }

  hide() {
    this.toast.close('loader');
  }
}
