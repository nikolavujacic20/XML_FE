import {Adresa} from "./Adresa";

export class Autor {
  anoniman: boolean | undefined;
  ime: string = "";
  prezime: string = "";
  adresa: Adresa = new Adresa();
  drzavljanstvo: string = "";
  godinaSmrti: number | undefined;
  pseudonim: string = "";

  public isValid(): boolean {
    return (this.ime.length > 0 &&
      this.prezime.length > 0 &&
      this.adresa.isValid() &&
      this.drzavljanstvo.length > 0) || (this.ime.length > 0 && this.godinaSmrti != undefined) || (this.anoniman == true);
  }
}

export class Lice {
  ime: string = "";
  prezime: string = "";
  adresa: Adresa = new Adresa();
  drzavljanstvo: string = "";
  godinaSmrti: number | undefined;

  public isValid(): boolean {
    return this.ime.length > 0 &&
      this.prezime.length > 0 &&
      this.adresa.isValid() &&
      this.drzavljanstvo.length > 0;
  }
}
