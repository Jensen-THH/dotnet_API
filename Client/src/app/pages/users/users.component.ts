import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/userServices';
import { UserDetail } from '../../interfaces/userDetail';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  users$: Observable<UserDetail[]> | undefined;
  filteredUsers$: Observable<UserDetail[]> | undefined;
  loading$ = new BehaviorSubject<boolean>(true);
  searchTerm$ = new BehaviorSubject<string>('');
  currentPage$ = new BehaviorSubject<number>(1);
  showAll$ = new BehaviorSubject<boolean>(false);
  pageSize = 12;
  selectedUser: any = null;

  ngOnInit(): void {
    this.users$ = this.userService.getAllUsers();
    this.filteredUsers$ = combineLatest([
      this.users$,
      this.searchTerm$,
      this.currentPage$,
      this.showAll$
    ]).pipe(
      map(([users, searchTerm, currentPage, showAll]) => {
        this.loading$.next(false);
        const filtered = users.filter(user => 
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (showAll) {
          return filtered;
        } else {
          const startIndex = (currentPage - 1) * this.pageSize;
          return filtered.slice(startIndex, startIndex + this.pageSize);
        }
      })
    );
  }

  onSearch(term: string): void {
    this.searchTerm$.next(term);
    this.currentPage$.next(1);
  }

  onPageChange(page: number): void {
    this.currentPage$.next(page);
  }

  getTotalPages(users: UserDetail[]): number {
    return Math.ceil(users.length / this.pageSize);
  }

  toggleShowAll(): void {
    this.showAll$.next(!this.showAll$.getValue());
  }

  showUserDetails(user: any) {
    this.selectedUser = user;
  }

  closeUserDetails() {
    this.selectedUser = null;
  }
}