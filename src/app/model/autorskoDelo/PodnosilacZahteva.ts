import {Adresa} from "./Adresa";

export class PodnosilacZahteva {
  ime: string = "";
  prezime: string = "";
  adresa: Adresa = new Adresa();
  drzavljanstvo: string = "";
  poslovnoIme: string = "";
  sediste: Adresa = new Adresa();
  brojTelefona: string = "";
  email: string = "";
  pseudonim: string = "";

  public isValid(): boolean {
    return this.email.length > 0 &&
      this.brojTelefona.length > 0 &&
      ((this.ime.length > 0 && this.prezime.length > 0
          && this.drzavljanstvo.length > 0 && this.adresa.isValid())
        || (this.sediste.isValid() && this.poslovnoIme.length > 0)
      );
  }
}
