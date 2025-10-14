export class Adresa {
  ulica?: string;
  brojUUlici?: number;
  postanskiBroj?: number;
  mesto?: string;
  drzava?: string;

  isValid() {
    return true;
  }
}
