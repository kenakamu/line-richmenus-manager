import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  constructor() { }

  public getToken(): string {
    return localStorage.getItem('token');
  }
}
