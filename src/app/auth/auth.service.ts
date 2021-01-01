import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken:	string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const signUpUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey;
const loginUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey;

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this.postRequest(signUpUrl, email, password);
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.postRequest(loginUrl, email, password);
  }

  logout(): void {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('user');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin(): void {
    const user: {
      email: string;
      id: string;
      _token: string;
      _tokenExpDate: string;
    } = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      return;
    }

    const loadedUser = new User(user.email, user.id, user._token, new Date(user._tokenExpDate));

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationTime = new Date(user._tokenExpDate).getTime() - new Date().getTime();
      this.autoLogout(expirationTime);
    }
  }

  autoLogout(expirationTime): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationTime);
  }

  private postRequest(url: string, email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(url, {
      email,
      password,
      returnSecureToken: true
    }).pipe(
      catchError(errorResponse => {
        let errorMessage = 'An unknown error occurred!';
        if (!errorResponse.error || !errorResponse.error.error) {
          return throwError(errorMessage);
        }

        switch (errorResponse.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already.';
            break;
          case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email does not exist.';
            break;
          case 'INVALID_PASSWORD':
            errorMessage = 'The password is invalid.';
            break;
        }

        return throwError(errorMessage);
      }),
      tap(responseData => {
        const expDate = new Date(new Date().getTime() + +responseData.expiresIn * 1000);
        const user = new User(responseData.email, responseData.localId, responseData.idToken, expDate);
        this.user.next(user);
        this.autoLogout(+responseData.expiresIn * 1000);
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }
}
