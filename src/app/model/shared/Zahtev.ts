import {SimpleUser} from "./User";

export class Zahtev {
  brojPrijave: string;
  datumPodnosenja: string;
  podnosiocEmail: string;
  obradjen: boolean = false;
}

export class DetaljiOZahtevu  {
  zahtev: Zahtev = new Zahtev();
  obrada: ObradaZahteva  | undefined;
}

export class ObradaZahteva  {
  sluzbenik!: SimpleUser;
  datumObrade!: string;
  odbijen: boolean = false;
  razlogOdbijanja: string = "";
}

export class ObradaZahtevaDTO  {
  sluzbenik!: SimpleUser;
  datumObrade!: string;
  odbijen: boolean = false;
  razlogOdbijanja: string = "";
  brojPrijave!: string;
}
