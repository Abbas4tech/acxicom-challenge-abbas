import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'auth-screen',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginScreen {
  loginForm: FormGroup<{
    username: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;
  isLoginMode = false;

  hide = signal(true);

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService
  ) {
    this.loginForm = this.createAuthForm();
  }

  private createAuthForm() {
    return this._fb.group<{
      username: FormControl<string | null>;
      email: FormControl<string | null>;
      password: FormControl<string | null>;
    }>({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  togglePasswordShow(event: MouseEvent) {
    this.hide.set(!this.hide());
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    if (this.isLoginMode) {
      this.loginForm.removeControl('username' as never, { emitEvent: false });
    } else {
      this.loginForm.addControl(
        'username',
        new FormControl('', [Validators.required, Validators.maxLength(15)])
      );
    }
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    if (this.isLoginMode && this.loginForm.value) {
      await this._authService.login(
        this.loginForm.value.email as string,
        this.loginForm.value.password as string
      );
    } else {
      await this._authService.signup(
        this.loginForm.value.username as string,
        this.loginForm.value.email as string,
        this.loginForm.value.password as string
      );
    }
  }

  clearForm() {
    this.loginForm.reset();
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
  }
}
