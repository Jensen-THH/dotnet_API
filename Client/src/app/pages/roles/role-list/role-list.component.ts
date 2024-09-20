import { CommonModule, NgFor, NgIf, AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { ConfirmDialogComponent } from '../../../../shared/components/ConfirmDialogComponent';
import { RolesServiceProxy, RoleResponseDto, CreateRoleDto } from '../../../../shared/service-proxies/remote-service-proxies';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, AsyncPipe, ReactiveFormsModule, RoleListComponent],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css',
  providers: [RolesServiceProxy,]
})
export class RoleListComponent {
  rolesServicesProxy = inject(RolesServiceProxy);
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);

  loading$ = new BehaviorSubject<boolean>(true);
  roles$: Observable<RoleResponseDto[]>;

  constructor() {
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
