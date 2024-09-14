import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  http = inject(HttpClient)
  apiUrl: string = environment.hostApiUrl;
  constructor() { }

  getAllRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Roles/GetRoleListName`);
  }


}
