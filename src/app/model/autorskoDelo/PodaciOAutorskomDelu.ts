export class PodaciOAutorskomDelu {
  naslovAutorskogDela: string = '';
  vrstaAutorskogDela: string = '';
  formaZapisaAutorskogDela: string = '';
  zasnivanoDelo: ZasnivanoDelo = new ZasnivanoDelo();
  autorZasnivanogDela: string | undefined;
  nacinKoriscenjaAutorskogDela: string = "";
  autorskoDeloStvorenoURadnomOdnosu: boolean = false;

  public isValid(): boolean {
    return this.naslovAutorskogDela.length > 0 &&
      this.vrstaAutorskogDela.length > 0 &&
      this.formaZapisaAutorskogDela.length > 0 &&
      this.nacinKoriscenjaAutorskogDela.length > 0;
  }
}

export class ZasnivanoDelo {
  naslov: string = '';
  autor: string = '';
}
