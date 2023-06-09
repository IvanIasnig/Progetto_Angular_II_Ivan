import { Component, OnInit } from '@angular/core';
import { Prodotto } from 'src/app/models/prodotto.interface';
import { ProdottiService } from 'src/app/service/prodotti.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-prodotti',
  templateUrl: './prodotti.component.html',
  styleUrls: ['./prodotti.component.scss']
})
export class ProdottiComponent implements OnInit {
  prodotti: Prodotto[] | undefined;

  constructor(
    private prodottiService: ProdottiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.prodottiService.recupera().subscribe((prodotti: Prodotto[]) => {
        this.prodotti = prodotti;
      });
    }, 1000);
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


