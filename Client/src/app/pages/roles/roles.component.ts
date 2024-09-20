import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/ConfirmDialogComponent';
import { MatDialogRef } from '@angular/material/dialog';
import { RoleListComponent } from "./role-list/role-list.component"; // Add this import
import { RolesServiceProxy, RoleResponseDto, CreateRoleDto } from '../../../shared/service-proxies/remote-service-proxies';
import { RoleFormComponent } from "./role-form/role-form.component";

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, AsyncPipe, ReactiveFormsModule, RoleListComponent, RoleFormComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
  providers: [RolesServiceProxy]
})
export class RolesComponent implements OnInit {
  rolesServicesProxy = inject(RolesServiceProxy);

  constructor() {
  }

  ngOnInit(): void {
  }

}