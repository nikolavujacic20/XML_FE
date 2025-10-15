import {Component, Input, OnInit} from '@angular/core';
import {DetaljiOZahtevu, ObradaZahtevaDTO} from "../../model/shared/Zahtev";
import {ZahteviService} from "../../service/zahtevi.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../service/auth.service";
import {User} from "../../model/shared/User";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  @Input() brojPrijave: string;
  @Input() obradjen: boolean;

  detaljiOZahtevu: DetaljiOZahtevu = new DetaljiOZahtevu();
  razlogOdbijanja: string = "";
  odbija: boolean = false;
  datumObrade = "";
  sluzbenik = "";
  sluzbenikEmail = "";
  odbijen: boolean;
  blob: Blob = new Blob();
  loggedUser: any;


  constructor(private servis: ZahteviService, private _snackBar: MatSnackBar, private authService: AuthService) {
  }

  ngOnInit() {
    if (this.loggedUser === undefined) {
      this.authService.getCurrentlyLoggedUser().subscribe((data: any) => {
        this.loggedUser = this.parseUser(data);
      });
    }
    if (this.obradjen) {
      this.servis.getDetaljiOObradi(this.brojPrijave).subscribe({
        next: value => {
          this.datumObrade = value.getElementsByTagName("datumObrade")[0].textContent;
          this.sluzbenik = value.getElementsByTagName("name")[0].textContent;
          this.sluzbenikEmail = value.getElementsByTagName("email")[0].textContent;
          this.odbijen = value.getElementsByTagName("odbijen")[0].textContent === "true";
        },
        error: err => console.log(err)
      })
    }
  }

  public obradiZahtev(odbijen: boolean) {
    let dto = new ObradaZahtevaDTO();
    dto.brojPrijave = this.brojPrijave;
    if (this.loggedUser.user == undefined) {
      this.authService.getCurrentlyLoggedUser().subscribe({
        next: (data: any) => this.loggedUser = this.parseUser(data),
        error: () => {
          this.loggedUser = {
            'name': 'Sluzbenik',
            'email': 'sluzbenik@gmail.com'
          }
        }
      })
    }
    dto.sluzbenik = {'name': this.loggedUser.name + " " + this.loggedUser.surname, 'email': this.loggedUser.email}
    dto.odbijen = odbijen;
    if (odbijen)
      dto.razlogOdbijanja = this.razlogOdbijanja;

    console.log(dto);

    this.servis.obradiZahtev(dto).subscribe(() => {
      this.servis.downloadResenje(dto.brojPrijave).subscribe({
        next: (data: Blob) => this.downloadFile(data, "resenje_", 'pdf', 'pdf'),
        error: () => this.snack("Greška pri generisanju fajla.")
      });
    })
  }

  private snack(message: string) {
    this._snackBar.open(message, '', {
      duration: 3000,
      panelClass: ['snack-bar']
    })
  }

  public odbijanjeZahteva() {
    if (this.odbija && this.razlogOdbijanja !== "") {
      this.obradiZahtev(true);
    } else {
      this.odbija = true;
    }
  }

  downloadResenje() {
    this.servis.downloadResenje(this.brojPrijave)
      .subscribe({
        next: (data) => this.downloadFile(data, 'resenje_', 'pdf', 'pdf'),
        error: () => this.snack("Greška pri generisanju fajla.")
      });
  }

  downloadPDF() {
    this.servis.downloadPDF(this.brojPrijave)
      .subscribe({
        next: (data) => this.downloadFile(data, "", 'pdf', 'pdf'),
        error: () => this.snack("Greška pri generisanju fajla.")
      });
  }

  downloadHTML() {
    this.servis.downloadHTML(this.brojPrijave)
      .subscribe({
        next: (data) => this.downloadFile(data, "", 'html', 'xhtml'),
        error: () => this.snack("Greška pri generisanju fajla.")
      });
  }

  downloadJSON() {
    this.servis.downloadJSON(this.brojPrijave)
      .subscribe({
        next: (data) => this.downloadFile(data, "", 'json', 'pdf'),
        error: () => this.snack("Greška pri generisanju fajla.")
      });
  }

  downloadRDF() {
    this.servis.downloadRDF(this.brojPrijave)
      .subscribe({
        next: (data) => this.downloadFile(data, "", 'rdf', 'pdf'),
        error: () => this.snack("Greška pri generisanju fajla.")
      });
  }

  downloadFile(data: Blob, prefix: string, ekstenzija: string, applicationType: string) {
    this.blob = new Blob([data], {type: 'application/' + applicationType});
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = prefix + this.brojPrijave + "." + ekstenzija;
    link.click();
  }

  parseUser(data: any) {
    let user = new User();
    user.email = data.getElementsByTagName("email")[0].textContent;
    user.name = data.getElementsByTagName("name")[0].textContent;
    user.surname = data.getElementsByTagName("surname")[0].textContent;
    user.phoneNumber = data.getElementsByTagName("phoneNumber")[0].textContent;
    user.role = data.getElementsByTagName("role")[0].textContent;

    return user;
  }
}
