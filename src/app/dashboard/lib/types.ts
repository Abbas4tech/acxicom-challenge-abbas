import { FormControl } from '@angular/forms';

export type ProfileFormData = {
  name: FormControl<string | null>;
  mobileNo: FormControl<string | null>;
  address: FormControl<string | null>;
  skills: FormControl<string[] | null>;
  hobbies: FormControl<string[] | null>;
  photo: FormControl<File | null>;
};

export type UserProfile = {
  id: string;
  name: string;
  mobileNo: string;
  address: string;
  skills: string[];
  hobbies: string;
  photoUrl: string;
  lastUpdated: string;
};

export type ProfileFormResponse = {
  name: string;
  mobileNo: string;
  address: string;
  skills: string[];
  hobbies: string;
  photo: File;
};
