import { Component, inject, OnInit } from '@angular/core';
import { RoleResponseDto, RolesServiceProxy, CreateRoleDto, API_BASE_URL } from '../../../shared/service-proxies/temp/service-proxies';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/ConfirmDialogComponent';
import { MatDialogRef } from '@angular/material/dialog'; // Add this import

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, AsyncPipe, ReactiveFormsModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
  providers: [RolesServiceProxy,]
})
export class RolesComponent implements OnInit {
  rolesServicesProxy = inject(RolesServiceProxy);
  fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);

  loading$ = new BehaviorSubject<boolean>(true);
  roles$: Observable<RoleResponseDto[]>;
  roleForm: FormGroup;

  constructor() {
    
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required]
    });
    this.roles$ = this.loadRoles();
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): Observable<RoleResponseDto[]> {
    this.loading$.next(true);
    return this.rolesServicesProxy.getRole().pipe(
      finalize(() => this.loading$.next(false))
    );
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
          this.roles$ = this.loadRoles();
        },
        (error) => {
          this.snackBar.open('Error creating role', 'Close', { duration: 3000 });
          console.error('Error creating role:', error);
        }
      );
    }
  }

  deleteRole(roleId: any): void {
    const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete this role?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rolesServicesProxy.deleteRole(roleId).subscribe(
          () => {
            this.snackBar.open('Role deleted successfully', 'Close', { duration: 3000 });
            this.roles$ = this.loadRoles(); // Refresh the roles list
          },
          (error) => {
            this.snackBar.open('Error deleting role', 'Close', { duration: 3000 });
            console.error('Error deleting role:', error);
          }
        );
      }
    });
  }
}