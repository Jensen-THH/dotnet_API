import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDetail } from '../interfaces/userDetail';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.hostApiUrl;

  getAllUsers(): Observable<UserDetail[]> {
    return this.http.get<UserDetail[]>(`${this.apiUrl}/Account/GetAll-User`);
  }
}
