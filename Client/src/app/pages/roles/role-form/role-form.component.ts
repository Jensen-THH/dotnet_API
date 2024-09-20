import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { RolesServiceProxy, RoleResponseDto, CreateRoleDto } from '../../../../shared/service-proxies/remote-service-proxies';
import { CommonModule, NgFor, NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, AsyncPipe, ReactiveFormsModule],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.css',
  providers:[RolesServiceProxy]
})
export class RoleFormComponent {
  rolesServicesProxy = inject(RolesServiceProxy);
  fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);

  roles$: Observable<RoleResponseDto[]>;
  roleForm: FormGroup;

  constructor() {
    
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  createRole(): void {
    if (this.roleForm.valid) {
      const newRole: CreateRoleDto = new CreateRoleDto({
        roleName: this.roleForm.get('roleName')?.value
      });
      this.rolesServicesProxy.createRole(newRole).subscribe(
        () => {
          this.snackBar.open('Role created successfully', 'Close', { duration: 3000 });
          this.roleForm.reset();
          // this.roles$ = this.loadRoles();
        },
        (error) => {
          this.snackBar.open('Error creating role', 'Close', { duration: 3000 });
          console.error('Error creating role:', error);
        }
      );
    }
  }
}
