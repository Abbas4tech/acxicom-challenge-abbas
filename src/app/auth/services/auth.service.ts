import { inject, Injectable } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import {
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition,
  MatSnackBar,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

const randomNumberGenerator = () => {
  return Math.floor(Math.random() * 100000 + 1);
};

export const randomAvatarUrlGenerator = () => {
  return `https://robohash.org/${randomNumberGenerator()}/?size=200x280`;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  private _snackbar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private _auth: Auth, private _router: Router) {
    this._auth.onAuthStateChanged((user) => {
      if (user) {
        this.user.next(user);
        this.showSnackbar(`Welcome back, ${user.displayName}!`);
      }
    });
  }

  showSnackbar(message: string): void {
    this._snackbar.open(message, undefined, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000,
    });
  }

  async login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this._auth, email, password)
      .then((userCredential) => {
        this.user.next(userCredential.user);
        this._router.navigate(['/dashboard']);
        this.showSnackbar(`Welcome back, ${userCredential.user?.displayName}!`);
      })
      .catch((error) => {
        console.error('Login failed', error);
        this.showSnackbar('Login failed. Please try again.');
        this.user.next(null);
      });
  }

  async signup(
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    return createUserWithEmailAndPassword(this._auth, email, password)
      .then(async (userCredential) => {
        this.user.next(userCredential.user);
        this._router.navigate(['/dashboard']);
        await updateProfile(userCredential.user, {
          displayName: username,
          photoURL: randomAvatarUrlGenerator(),
        });
        this.showSnackbar(`Welcome, ${userCredential.user?.displayName}!`);
      })
      .catch((error) => {
        console.error('Signup failed', error);
        this.showSnackbar('Signup failed. Please try again.');
        this.user.next(null);
      });
  }

  async logout(): Promise<void> {
    return signOut(this._auth)
      .then(() => {
        this.user.next(null);
        this._router.navigate(['/login']);
        this.showSnackbar('You have been logged out.');
      })
      .catch((error) => {
        console.error('Logout failed', error);
        this.showSnackbar('Logout failed. Please try again.');
      });
  }
}
