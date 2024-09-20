import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialog, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { addDays, format } from 'date-fns';
import { CalendarDetailPopupComponent } from './calendar-detail-popup/calendar-detail-popup.component';
import { saveAs } from 'file-saver'; // Import file-saver for exporting

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone: true,
  imports: [CommonModule, NgIf, ReactiveFormsModule, FormsModule, MatDialogModule]
})
export class CalendarComponent implements OnInit, AfterViewInit {
  days: {
    date: Date,
    formattedDate: string,
    note: string,
    marked: boolean,
    vocabulary: { key: string, meaning: string }[],
    vocabularyInput: string, // Input for vocabulary
    errorMessage: string // Error message for validation,
    isCollapsed: boolean
  }[] = [];
  private calendarDataKey = 'calendarData';
  private START_DATE = new Date(2024, 8, 20); // Ngày 20 tháng 9 năm 2024

  uttr: SpeechSynthesisUtterance;
  isSpeaking: boolean = false; // Track if speaking

  constructor(private dialog: MatDialog) {
    this.uttr = new SpeechSynthesisUtterance();
    this.uttr.lang = 'en-US';
  }

  ngOnInit(): void {
    this.loadFromLocalStorage();
    if (this.days.length === 0) {
      this.generateDays();
    }
  }

  addVocabulary(index: number): void {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '400px',
      data: { vocabularyInput: this.days[index].vocabularyInput, title: 'Add Vocabulary' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.days[index].vocabularyInput = result;
        // Thực hiện thêm vocabulary vào danh sách
        const vocabArray = result.split(/\n|;/).map((item: string) => { // Split by new line or semicolon
          const trimmedItem = item.trim();
          if (trimmedItem) {
            const [key, meaning] = trimmedItem.split(':');
            if (key && meaning) {
              return { key: key.trim(), meaning: meaning.trim() };
            }
          }
          return null;
        }).filter(Boolean);
        this.days[index].vocabulary.push(...vocabArray);
        // Loại bỏ trùng lặp
        this.days[index].vocabulary = this.removeDuplicates(this.days[index].vocabulary);
        this.saveToLocalStorage();
      }
    });
  }

  private removeDuplicates(vocabulary: { key: string, meaning: string }[]): { key: string, meaning: string }[] {
    const uniqueKeys = new Set();
    return vocabulary.filter(item => {
      const isDuplicate = uniqueKeys.has(item.key);
      uniqueKeys.add(item.key);
      return !isDuplicate;
    });
  }

  generateDays(): void {
    localStorage.removeItem(this.calendarDataKey);
    const today = this.START_DATE; // Sử dụng ngày bắt đầu
    for (let i = 0; i < 130; i++) {
      const day = addDays(today, i);
      this.days.push({
        date: day,
        formattedDate: format(day, 'MM/dd/yyyy'),
        note: '',
        marked: false,
        vocabulary: [],
        vocabularyInput: '', // Initialize input
        errorMessage: '', // Initialize error message,
        isCollapsed: false,
      });
    }
    this.saveToLocalStorage();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.adjustHeightOnLoad(); // Call the method here
    });
  }

  toggleMark(index: number): void {
    this.days[index].marked = !this.days[index].marked;
    this.saveToLocalStorage();
  }

  saveNote(index: number, note: string): void {
    this.days[index].note = note;
    this.saveToLocalStorage();
  }

  openDetailPopup(day: any): void {
    console.log('Opening detail popup with data:', day);
    const dialogRef = this.dialog.open(CalendarDetailPopupComponent, {
      data: day
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveNote(day.index, result.note); // Save the updated note
      }
    });
  }

  // Lưu lịch vào localStorage
  saveToLocalStorage(): void {
    localStorage.setItem(this.calendarDataKey, JSON.stringify(this.days));
  }

  // Tải dữ liệu từ localStorage
  loadFromLocalStorage(): void {
    try {
      const data = localStorage.getItem(this.calendarDataKey);
      if (data) {
        this.days = JSON.parse(data);
        this.days = this.days.map(day => ({
          ...day,
          date: new Date(day.date),
          errorMessage: '', // Reset error message on load
          vocabularyInput: '',
        }));
      } else {
        this.generateDays(); // Generate days if localStorage is empty
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      this.generateDays(); // Generate days if there's an error
    }
  }

  isPast(date: Date): boolean {
    const today = new Date();
    const todayMidnight = new Date(today.setHours(0, 0, 0, 0));
    return date < todayMidnight;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  adjustHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
  }

  // New method to adjust height on load
  adjustHeightOnLoad(): void {
    const textareas = document.querySelectorAll('textarea'); // Select all textareas
    textareas.forEach(textarea => {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    });
  }

  removeVocabulary(dayIndex: number, vocabIndex: number): void {
    this.days[dayIndex].vocabulary.splice(vocabIndex, 1);
    this.saveToLocalStorage(); // Save the updated days to localStorage
  }

  exportData(): void {
    const json = JSON.stringify(this.days);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'calendarData.json');
  }

  importData(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = JSON.parse(e.target.result);
        this.days = data.map((day: any) => ({
          ...day,
          date: new Date(day.date),
          errorMessage: '',
          vocabularyInput: ''
        }));
        this.saveToLocalStorage(); // Save imported data to localStorage
      };
      reader.readAsText(file);
    }
  }
  editVocabulary(dayIndex: number, vocabIndex: number): void {
    const vocab = this.days[dayIndex].vocabulary[vocabIndex];
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '400px',
      data: { vocabularyInput: `${vocab.key}:${vocab.meaning}`, title: 'Change Vocabulary' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const [key, meaning] = result.split(':');
        if (key && meaning) {
          this.days[dayIndex].vocabulary[vocabIndex] = { key: key.trim(), meaning: meaning.trim() };
          this.saveToLocalStorage();
        }
      }
    });
  }

  confirmDeleteVocabulary(dayIndex: number, vocabIndex: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to delete this vocabulary item?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeVocabulary(dayIndex, vocabIndex); // Call the existing remove method
      }
    });
  }

  removeAllVocabulary(index: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to delete all vocabulary items?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.days[index].vocabulary = []; // Clear all vocabulary items
        this.saveToLocalStorage();
      }
    });
  }
  toggleCollapse(index: any): void {
    this.days[index].isCollapsed = !this.days[index].isCollapsed;
    this.saveToLocalStorage();
  }

  speakVocabulary(i: any, j: any) {
    if (i in this.days && j in this.days[i].vocabulary) {
      this.uttr.text = this.days[i].vocabulary[j].key;
      window.speechSynthesis.speak(this.uttr);
    }
  }

  speakAllVocabularyWithTimeSleep(i: any) {
    const vocabularyList = this.days[i].vocabulary.map(vocab => vocab.key).join(' ');
    this.speakWithTimeSleep(vocabularyList);
  }

  private speechTimeouts: ReturnType<typeof setTimeout>[] = [];

  speakWithTimeSleep(value: any) {
    const words = value.split(' ');
    let delay = 0;
    words.forEach((word: string) => {
      this.speechTimeouts.push(setTimeout(() => {
        this.speak(word);
      }, delay));
      delay += 2000; // 1 second delay
    });
  }

  speak(value: any) {
    this.uttr.text = value;
    this.isSpeaking = true; // Set to true when speaking
    window.speechSynthesis.speak(this.uttr);
  }

  pauseOrStop(flag: any) {
    if (flag === 'pause') {
      window.speechSynthesis.pause();
    } else if (flag === 'stop') {
      window.speechSynthesis.cancel();
      this.speechTimeouts.forEach(timeout => clearTimeout(timeout));
      this.speechTimeouts = [];
      this.isSpeaking = false; // Set to false when stopped
    }
  }
}
// Định nghĩa nội dung dialog
@Component({
  selector: 'dialog-content-example',
  template: `
    <p mat-dialog-title class="text-xl font-bold text-blue-500 text-center pt-5">{{data?.title}}</p>
    <mat-dialog-content class="mt-4">
      <textarea [(ngModel)]="data.vocabularyInput" placeholder='Enter vocabulary in format key:meaning pairs separated by new lines or semicolons' class="p-3 border-2 border-gray-300 w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
    </mat-dialog-content>
    <mat-dialog-actions class="mt-4">
      <button mat-button (click)="onAdd()" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4">{{data?.title}}</button>
      <button mat-button (click)="onCancel()" class="ml-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4">Cancel</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogContent, NgIf, FormsModule, MatDialogActions]
})
export class DialogContentExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onAdd(): void {
    this.dialogRef.close(this.data.vocabularyInput);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}


@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto">
      <p class="text-2xl font-bold text-center text-red-600">Confirm Delete</p>
      <div class="mt-4">
        <p class="text-gray-700 text-base">{{ data.message }}</p>
      </div>
      <div class="mt-6 flex justify-end space-x-4">
        <button mat-button (click)="onCancel()" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded">Cancel</button>
        <button mat-button (click)="onConfirm()" class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">Delete</button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [MatDialogContent, NgIf, FormsModule, MatDialogActions]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) { }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}