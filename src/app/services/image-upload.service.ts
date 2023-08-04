import { Injectable } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  constructor(private storage: Storage) {}

  async uploadImage(image: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    const result = await uploadBytes(storageRef, image);
    return await getDownloadURL(result.ref);
  }
}
