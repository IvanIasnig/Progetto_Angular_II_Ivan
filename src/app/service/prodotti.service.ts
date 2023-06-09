import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Prodotto } from '../models/prodotto.interface';
import { AuthService } from '../auth/auth.service';
import { Observable, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ProdottiService {
    baseURL = environment.baseURL;

    constructor(private http: HttpClient, private authService: AuthService) {}

    recupera() {
        return this.http.get<Prodotto[]>(`${this.baseURL}movies-popular`);
    }

    recuperaPreferiti(userId: number): Observable<Prodotto[]> {
        return this.http
            .get<{ movieId: number; userId: number; id: number }[]>(
                `${this.baseURL}favorites?userId=${userId}`
            )
            .pipe(
                switchMap((favorites) => {
                    if (favorites.length > 0) {
                        let requests = favorites.map((fav) =>
                            this.http.get<Prodotto>(
                                `${this.baseURL}movies-popular/${fav.movieId}`
                            )
                        );
                        return forkJoin(requests);
                    } else {
                        return [];
                    }
                })
            );
    }

    aggiungiAiPreferiti(movieId: number, userId: number) {
        const url = `${this.baseURL}favorites`;
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );
        return this.http.post(url, { movieId, userId }, { headers });
    }

    rimuoviDaiPreferiti(id: number) {
        const url = `${this.baseURL}favorites/${id}`;
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );
        return this.http.delete(url, { headers });
    }
}
