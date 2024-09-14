import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../interfaces/login-request';
import { map, Observable } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.hostApiUrl;
  http = inject(HttpClient);
  tokenKey = 'token';

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/account/login`, loginRequest).pipe(
      map((response) => {
        if (response.isSuccess) {
          localStorage.setItem(this.tokenKey, response.token);
        }
        return response;
      })
    );
  }

  register(registerrq: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/account/register`, registerrq);
  }

  accountUserDetail(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Account/user-detail`)
  }

  isLoggedIn = (): boolean => {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired();
  }

  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;
    const decodedToken = jwtDecode(token);
    const isTokenExpired = Date.now() >= decodedToken['exp']! * 1000;
    if (isTokenExpired) this.logout()
    return isTokenExpired;
  }

  logout = (): void => {
    localStorage.removeItem(this.tokenKey);
  }

  getToken = (): string | null => localStorage.getItem(this.tokenKey) || '';

  getUserDetail = () => {
    const token = this.getToken();
    if (!token) return true;

    const decodedToken: any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.nameid,
      name: decodedToken.name,
      email: decodedToken.email,
      role: decodedToken.role || [],
    };
    return userDetail;
  }
}
