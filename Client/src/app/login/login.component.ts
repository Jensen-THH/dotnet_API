import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Custom validator for password complexity
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecialChar = /[\W_]/.test(value); // Non-alphanumeric characters

    const valid = hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;

    return !valid ? { passwordStrength: true } : null;
  };

}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  fb = inject(FormBuilder);
  loginForm!: FormGroup;
  authService = inject(AuthService);
  matSnacBar = inject(MatSnackBar);
  router = inject(Router);
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator()]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginRequest: any = this.loginForm.value;
      console.log('Form Submitted!', { loginRequest });
      this.authService.login(loginRequest).subscribe({
        next: (res) => {
          this.matSnacBar.open(
            res?.message, 'Close', { duration: 5000, horizontalPosition: 'center' }
          )
          this.router.navigate(['/'])
        },
        error:(err) => {
          this.matSnacBar.open(
            err?.error?.message, 'Close', { duration: 5000, horizontalPosition: 'center' }
          )
        },
      })
    }
  }
}
