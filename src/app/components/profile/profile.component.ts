import { Component, OnInit, effect, inject } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { LoaderService } from 'src/app/services/loader.service';
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

  loader = inject(LoaderService);

  constructor(
    private imageUploadService: ImageUploadService,
    private toast: HotToastService,
    private usersService: UsersService,
    private fb: NonNullableFormBuilder
  ) {
    effect(() => {
      this.profileForm.patchValue({ ...this.user() });
    });
  }

  ngOnInit(): void {}

  async uploadFile(event: any) {
    this.loader.show('Uploading profile image...');

    try {
      const photoURL = await this.imageUploadService.uploadImage(
        event.target.files[0],
        `images/profile/${this.user()?.uid}`
      );
      await this.usersService.updateUser({
        uid: this.user()?.uid ?? '',
        photoURL,
      });
      this.toast.success('Image uploaded successfully');
    } catch (error: any) {
      this.toast.error('There was an error in uploading the image');
    } finally {
      this.loader.hide();
    }
  }

  async saveProfile() {
    const { uid, ...data } = this.profileForm.value;

    if (!uid) {
      return;
    }
    this.loader.show('Saving profile data...');
    try {
      await this.usersService.updateUser({ uid, ...data });
      this.toast.success('Profile updated successfully');
    } catch (error) {
      this.toast.error('There was an error in updating the profile');
    } finally {
      this.loader.hide();
    }
  }
}
