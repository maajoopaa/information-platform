import { Injectable } from '@angular/core';
import {AuthorizationResponse} from '../api/models/authorization-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private storageKey = 'authData';

  constructor() {}

  setAuthData(auth: AuthorizationResponse) {
    localStorage.setItem(this.storageKey, JSON.stringify(auth));
  }

  getAuthData(): AuthorizationResponse | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) as AuthorizationResponse : null;
  }

  clearAuthData() {
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    return !!this.getAuthData()?.token;
  }
}
