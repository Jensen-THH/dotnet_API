import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto">
      <p class="text-2xl font-bold text-gray-900">Confirm Delete</p>
      <div class="mt-4">
        <p class="text-gray-700 text-base">{{ data.message }}</p>
      </div>
      <div class="mt-6 flex justify-end space-x-4">
        <button mat-button class="text-gray-500 hover:text-gray-700 transition duration-200" (click)="onCancel()">Cancel</button>
        <button mat-button class="bg-red-500 text-white hover:bg-red-600 rounded-lg px-6 py-2 transition duration-200 shadow-md transform hover:scale-105" (click)="onConfirm()">Delete</button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
