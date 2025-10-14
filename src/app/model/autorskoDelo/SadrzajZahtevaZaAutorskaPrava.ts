import {PodnosilacZahteva} from "./PodnosilacZahteva";
import {Autor} from "./Autor";
import {Punomocnik} from "./Punomocnik";
import {PodaciOAutorskomDelu} from "./PodaciOAutorskomDelu";

export class SadrzajZahtevaZaAutorskaPrava {
  podnosilacZahteva!: PodnosilacZahteva;
  autor: Autor = new Autor();
  podaciOPunomocniku: Punomocnik = new Punomocnik();
  autorskoDelo!: PodaciOAutorskomDelu;

  constructor(podnosioc: PodnosilacZahteva, autor: Autor, punomocnik: Punomocnik, delo: PodaciOAutorskomDelu) {
    this.autor = autor;
    this.autorskoDelo = delo;
    this.podnosilacZahteva = podnosioc;
    this.podaciOPunomocniku = punomocnik;
  }

  public isValid(): boolean {
    return this.podnosilacZahteva.isValid() && this.autor.isValid() && this.autorskoDelo.isValid();
  }
}
