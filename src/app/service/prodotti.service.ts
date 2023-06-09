import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Prodotto } from '../models/prodotto.interface';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProdottiService {
  baseURL = environment.baseURL;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  recupera() {
    return this.http.get<Prodotto[]>(`${this.baseURL}movies-popular`);
  }

  aggiungiAiPreferiti(movieId: number, userId: number) {
    const url = `${this.baseURL}favorites`;

    const token = this.authService.getToken(); // Assume che il metodo `getToken` restituisca il token dell'utente autenticato dal servizio AuthService

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(url, { movieId, userId }, { headers });
  }
}

