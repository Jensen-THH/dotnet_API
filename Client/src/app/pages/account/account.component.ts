import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { UserDetail } from '../../interfaces/userDetail';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  authService = inject(AuthService);
  userDetail$: Observable<UserDetail>;
  loading$ = new BehaviorSubject<boolean>(true);

  constructor() {
    this.userDetail$ = this.authService.accountUserDetail().pipe(
      finalize(() => this.loading$.next(false))
    );
  }

  getFieldClass(value: boolean): string {
    return value ? 'text-green-600' : 'text-red-600';
  }
}