// profile-form.component.ts
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProfileFormData } from '../../lib/types';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatOptionModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFormComponent {
  profileForm: FormGroup<ProfileFormData>;
  previewUrl: string | ArrayBuffer | null = null;
  photoErrorMessage = '';
  @ViewChild('fileInput') fileInput!: ElementRef;

  readonly dialogRef = inject(MatDialogRef<ProfileFormComponent>);

  availableSkills: string[] = [
    'Angular',
    'React',
    'Vue',
    'JavaScript',
    'TypeScript',
    'HTML/CSS',
    'Node.js',
    'Python',
    'Java',
    'C#',
  ];

  constructor(
    private fb: FormBuilder,
    private _changeDetection: ChangeDetectorRef
  ) {
    this.profileForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', Validators.required],
      skills: [[], Validators.required],
      hobbies: ['', Validators.required],
      photo: ['', Validators.required],
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    // Reset error message
    this.photoErrorMessage = '';

    // Validate file type
    if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
      this.photoErrorMessage = 'Invalid file type. Only JPG/PNG allowed.';
      this.profileForm.get('photo')?.setErrors({ invalidType: true });
      this._changeDetection.detectChanges();
      return;
    }

    // Validate file size
    if (file.size > 2 * 1024 * 1024) {
      this.photoErrorMessage = 'File too large. Max 2MB allowed.';
      this.profileForm.get('photo')?.setErrors({ sizeExceeded: true });
      this._changeDetection.detectChanges();
      return;
    }

    // Read file for preview
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
      this.profileForm.patchValue({ photo: file });
      this.profileForm.get('photo')?.setErrors(null);
      this._changeDetection.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  removePhoto(event: Event) {
    event.stopPropagation();
    this.previewUrl = null;
    this.profileForm.patchValue({ photo: null });
    this.profileForm.get('photo')?.setErrors({ required: true });
    this.photoErrorMessage = 'Photo is required';
    this.fileInput.nativeElement.value = '';
    this._changeDetection.detectChanges();
  }

  showPhotoError(): boolean {
    const photoControl = this.profileForm.get('photo');
    return !!(
      (photoControl?.invalid && photoControl?.touched) ||
      (photoControl?.invalid && this.profileForm.get('photo')?.dirty)
    );
  }

  addUser() {
    // Mark all controls as touched to show errors
    this.profileForm.markAllAsTouched();

    if (this.profileForm.valid) {
      this.dialogRef.close(this.profileForm.value);
    } else {
      // Handle photo error specifically
      if (!this.profileForm.get('photo')?.value) {
        this.photoErrorMessage = 'Photo is required';
      }
      this._changeDetection.detectChanges();
    }
  }

  closeForm() {
    this.dialogRef.close();
  }
}
