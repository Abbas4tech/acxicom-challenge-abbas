import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '@angular/fire/auth';
import { ProfileFormResponse, UserProfile } from '../lib/types';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  CollectionReference,
  DocumentData,
} from '@angular/fire/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  Storage,
} from '@angular/fire/storage';
import { Observable, from, of, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProfileDataService {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  user!: User;

  constructor() {
    this.authService.user.subscribe((user) => {
      if (user) this.user = user;
    });
  }

  /**
   * Fetch all profiles related to the currently authenticated user
   */
  getProfileUser(): Observable<UserProfile[]> {
    if (!this.user?.uid) return of([]);

    const profilesSubCol = collection(
      this.firestore,
      `${this.user.uid}`
    ) as CollectionReference<UserProfile & DocumentData>;

    return collectionData(profilesSubCol, { idField: 'id' }).pipe(
      catchError((error) => {
        console.error('Failed to fetch profiles:', error);
        return throwError(() => new Error('Could not load profiles'));
      })
    );
  }

  /**
   * Create a new profile for the authenticated user
   */
  createProfileUser(profileData: ProfileFormResponse): Observable<any> {
    if (!this.user?.uid) {
      return throwError(() => new Error('User not authenticated'));
    }

    const filePath = `user-profiles/${this.user.uid}/${Date.now()}_${
      profileData.photo.name
    }`;
    const fileRef = ref(this.storage, filePath);

    return from(uploadBytes(fileRef, profileData.photo)).pipe(
      switchMap(() => getDownloadURL(fileRef)),
      switchMap((photoUrl) => {
        const profileDoc: UserProfile = {
          name: profileData.name,
          mobileNo: profileData.mobileNo,
          address: profileData.address,
          skills: profileData.skills,
          hobbies: profileData.hobbies,
          photoUrl,
          lastUpdated: new Date().toISOString(),
        };

        const profilesSubCol = collection(this.firestore, `${this.user.uid}`);

        return from(addDoc(profilesSubCol, profileDoc));
      }),
      catchError((error) => {
        console.error('Profile creation failed:', error);
        deleteObject(fileRef).catch(() => {}); // fail silently
        return throwError(() => new Error('Could not create profile'));
      })
    );
  }
}
