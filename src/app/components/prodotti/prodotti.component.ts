import { Component, OnInit } from '@angular/core';
import { Prodotto } from 'src/app/models/prodotto.interface';
import { ProdottiService } from 'src/app/service/prodotti.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-prodotti',
  templateUrl: './prodotti.component.html',
  styleUrls: ['./prodotti.component.scss']
})
export class ProdottiComponent implements OnInit {
  prodotti: Prodotto[] | undefined;
  preferiti: Prodotto[] | undefined;

  constructor(
    private prodottiService: ProdottiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.prodottiService.recupera().subscribe((prodotti: Prodotto[]) => {
        this.prodotti = prodotti;
      });
    }, 1000);

    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.prodottiService.recuperaPreferiti(userId).subscribe(
        (preferiti: Prodotto[]) => {
          this.preferiti = preferiti;
        },
        (error) => {
          console.error('Errore durante il recupero dei preferiti.', error);
        }
      );
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  aggiungiAiPreferiti(movieId: number) {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.prodottiService.aggiungiAiPreferiti(movieId, userId).subscribe(
        () => {
          console.log('Film aggiunto ai preferiti.');
        },
        error => {
          console.error(
            'Errore durante l\'aggiunta del film ai preferiti.',
            error
          );
        }
      );
    }
  }
}


