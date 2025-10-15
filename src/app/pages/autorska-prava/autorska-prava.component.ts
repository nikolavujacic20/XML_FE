import {Component} from '@angular/core';
import {Autor} from "../../model/autorskoDelo/Autor";
import {Punomocnik} from "../../model/autorskoDelo/Punomocnik";
import {PodnosilacZahteva} from "../../model/autorskoDelo/PodnosilacZahteva";
import {AutorskaPravaService} from "../../service/autorskaPrava.service";
import {SadrzajZahtevaZaAutorskaPrava} from "../../model/autorskoDelo/SadrzajZahtevaZaAutorskaPrava";
import {PodaciOAutorskomDelu} from "../../model/autorskoDelo/PodaciOAutorskomDelu";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-autorska-prava',
  templateUrl: './autorska-prava.component.html',
  styleUrls: ['./autorska-prava.component.css']
})
export class AutorskaPravaComponent {
  tipPodnosiocaZahteva: string = 'fizickoLice';
  punomocnik: Punomocnik = new Punomocnik();
  podnosilacJeIAutor: boolean = false;
  pseudonim: string = "";
  autorskoDelo: PodaciOAutorskomDelu = new PodaciOAutorskomDelu();
  autor: Autor = new Autor();
  podnosilac: PodnosilacZahteva = new PodnosilacZahteva();
  valid: boolean = true;
  tipAutora: string = "ziv";

  opis: any;
  primer: any;

  constructor(private servis: AutorskaPravaService, private _snackBar: MatSnackBar) {
  }

  private static autorIzPodnosioca(p: PodnosilacZahteva): Autor {
    let autor = new Autor();
    autor.pseudonim = p.pseudonim;
    autor.ime = p.ime;
    autor.prezime = p.prezime;
    autor.adresa = p.adresa;
    autor.drzavljanstvo = p.drzavljanstvo;
    autor.anoniman = false;
    return autor;
  }

  podnesiZahtev() {
    if (this.podnosilacJeIAutor) {
      this.autor = AutorskaPravaComponent.autorIzPodnosioca(this.podnosilac);
    } else {
      this.autor.anoniman = this.tipAutora == "anoniman";
    }
    let zahtev = new SadrzajZahtevaZaAutorskaPrava(this.podnosilac, this.autor, this.punomocnik, this.autorskoDelo);
    if (this.opis == null || this.primer == null) {
      this._snackBar.open("Morate priložiti potrebne dokumente.", '', {
        duration: 3000,
        panelClass: ['snack-bar']
      })
    } else {
      this.valid = zahtev.isValid();
      if (this.valid) {
        this.servis.podnesiZahtev(zahtev).subscribe({
          next: data => {
            this.uploadPrilogsForkJoin(data);
          },
          error: (err) => {
            this.uploadPrilogsForkJoin(err.error.text);
          }
        });
      } else {
        this._snackBar.open("Nevalidni podaci.", '', {
          duration: 3000,
          panelClass: ['snack-bar']
        })
      }
    }
  }

  uploadPrilogsForkJoin(brojPrijave: string) {
    this.servis.postPrilog(brojPrijave, "OPIS", this.opis).subscribe(() => {
      this.servis.postPrilog(brojPrijave, "PRIMER", this.primer).subscribe(() => {
        this.servis.saveAfterPrilogAddition(brojPrijave).subscribe(() => {
          this._snackBar.open("Vaš zahtev je uspešno podnet.", '', {
            duration: 3000,
            panelClass: ['snack-bar']
          })
        });
      });
    });
  }

  selectOpis(event: any) {
    this.opis = event.target.files[0];
  }

  selectPrimer(event: any) {
    this.primer = event.target.files[0];
  }
}
