import { Component, OnInit, effect, inject } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsersService } from 'src/app/services/users.service';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user = this.usersService.currentUserProfile;

  profileForm = this.fb.group({
    uid: [''],
    displayName: [''],
    firstName: [''],
    lastName: [''],
    phone: [''],
    address: [''],
  });

  toastService = inject(ToastService);

  constructor(
    private imageUploadService: ImageUploadService,
    private usersService: UsersService,
    private fb: NonNullableFormBuilder
  ) {
    effect(() => {
      this.profileForm.patchValue({ ...this.user() });
    });
  }

  ngOnInit(): void {}

  async uploadFile(event: any) {
    this.toastService.showLoader('Uploading profile image...');

    try {
      const photoURL = await this.imageUploadService.uploadImage(
        event.target.files[0],
        `images/profile/${this.user()?.uid}`
      );
      await this.usersService.updateUser({
        uid: this.user()?.uid ?? '',
        photoURL,
      });
      this.toastService.showSuccess('Image uploaded successfully');
    } catch (error: any) {
      this.toastService.showError('There was an error in uploading the image');
    } finally {
      this.toastService.hideLoader();
    }
  }

  async saveProfile() {
    const { uid, ...data } = this.profileForm.value;

    if (!uid) {
      return;
    }
    this.toastService.showLoader('Saving profile data...');
    try {
      await this.usersService.updateUser({ uid, ...data });
      this.toastService.showSuccess('Profile updated successfully');
    } catch (error) {
      this.toastService.showError('There was an error in updating the profile');
    } finally {
      this.toastService.hideLoader();
    }
  }
}
