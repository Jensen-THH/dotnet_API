import { CommonModule, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-calendar-detail-popup',
  standalone: true,
  imports: [CommonModule, NgIf, ReactiveFormsModule, FormsModule],
  templateUrl: './calendar-detail-popup.component.html',
  styleUrl: './calendar-detail-popup.component.css'
})
export class CalendarDetailPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<CalendarDetailPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}