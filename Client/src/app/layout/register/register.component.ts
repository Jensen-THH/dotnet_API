import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { passwordValidator } from '../../../shared/Utilities/validators';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    // Import Angular Material Modules
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    // Import CommonModule for Angular directives
    CommonModule
  ]
})
export class RegisterComponent {
  authService = inject(AuthService);
  matSnacBar = inject(MatSnackBar);
  router = inject(Router);
  rolesService = inject(RoleService);
  registerForm: FormGroup;
  availableRoles = ['Admin', 'User', 'Manager', 'Editor']; // Example roles
  selectedRoles: string[] = [];
  showRolesMenu: boolean = false;
  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), passwordValidator()]],
      confirmPassword: ['', [Validators.required]],
      roles: [[], Validators.required] // Roles will be an array
    }, { validators: this.passwordsMatchValidator });

    this.rolesService.getAllRolesName().subscribe((res)=> {
      this.availableRoles = res || [];
    })
  }

  // Custom validator to check if passwords match
  passwordsMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordsNotMatch: true });
      return { passwordsNotMatch: true };
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      this.authService.register(formData).subscribe({
        next: (res) => {
          this.matSnacBar.open(
            res?.message, 'Close', { duration: 5000, horizontalPosition: 'center' }
          )
          this.router.navigate(['login'])
        },
        error:(err) => {
          console.log(err);
          
          this.matSnacBar.open(
            err.error[0]?.description, 'Close', { duration: 5000, horizontalPosition: 'center' }
          )
        },
      })
      // Handle form submission, e.g., send data to server
    }
  }

  toggleRolesMenu() {
    this.showRolesMenu = !this.showRolesMenu;
  }

  toggleRole(role: string) {
    const index = this.selectedRoles.indexOf(role);
    if (index > -1) {
      this.selectedRoles.splice(index, 1);
    } else {
      this.selectedRoles.push(role);
    }
    this.registerForm.controls['roles'].setValue(this.selectedRoles);
  }

}
