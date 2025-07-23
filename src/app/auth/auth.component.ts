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
    password: FormControl<string | null>;
  }>;

  hide = signal(true);

  constructor(private _fb: FormBuilder, private _router: Router) {
    this.loginForm = this.createAuthForm();
  }

  private createAuthForm() {
    return this._fb.group<{
      username: FormControl<string | null>;
      password: FormControl<string | null>;
    }>({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  togglePasswordShow(event: MouseEvent) {
    this.hide.set(!this.hide());
  }

  onSubmit() {
    console.log('Form Submitted', this.loginForm.value);
    this._router.navigate(['dashboard']);
  }

  clearForm() {
    this.loginForm.reset();
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
  }
}
