import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {SadrzajZahtevaZaAutorskaPrava} from "../model/autorskoDelo/SadrzajZahtevaZaAutorskaPrava";
import {AuthService} from "./auth.service";
import * as JsonToXML from "js2xmlparser";

@Injectable({
  providedIn: 'root'
})
export class AutorskaPravaService {

  private readonly autorskaPravaUrl= 'http://localhost:8003/autorskaPrava';

  constructor(private http: HttpClient) {
  }

  public podnesiZahtev(zahtev: SadrzajZahtevaZaAutorskaPrava): Observable<string> {
    const xmlZahtev = JsonToXML.parse("zahtevZaAutorskaPravaDTO", zahtev);
    return this.http.post<string>(this.autorskaPravaUrl, xmlZahtev, AuthService.getHttpOptions());
  }

  public dobaviZahtev(brojPrijave: string): Observable<Object> {
    return this.http.get<Object>(this.autorskaPravaUrl + "/" + brojPrijave, AuthService.getHttpOptions());
  }

  public postPrilog(brojPrijave: string, tipPrilog: string, file: any) {
    let formData = new FormData();
    let brojPrijaveParts: string[] = brojPrijave.split("/");
    formData.append("file", file);
    return this.http.post<Object>(this.autorskaPravaUrl + "/file-upload/" +
      brojPrijaveParts[0] + "/" + brojPrijaveParts[1] + "/" + tipPrilog, formData, this.getNoContentTypeHttpOptions());
  }

  public saveAfterPrilogAddition(brojPrijave: string) {
    const brojPrijaveParts: string[] = brojPrijave.split("/");
    return this.http.get<Object>(this.autorskaPravaUrl + "/save/" + brojPrijaveParts[0] + "-" + brojPrijaveParts[1], AuthService.getHttpOptions());
  }

  public getNoContentTypeHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Authorization': localStorage.getItem('token') || 'authkey',
      })
    };
  }

}
