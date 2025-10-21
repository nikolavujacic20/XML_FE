import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import * as JsonToXML from "js2xmlparser";
import {DetaljiOZahtevu , ObradaZahtevaDTO , Zahtev} from "../model/shared/Zahtev";
import {MetadataSearchParamsDTO, TextSearchDTO} from "../model/search/SearchParams";

@Injectable({
  providedIn: 'root'
})
export class ZahteviService {

  private readonly autorskaPravaUrl= 'http://localhost:8003';


  constructor(private http: HttpClient) {
  }

  public getDetaljiOObradi(brojPrijave: string | null): Observable<any> {
    const xmlZahtev = JsonToXML.parse("brojPrijave", {'broj': brojPrijave});
    return this.http.post<any>(this.getDetaljiOZahtevuUrl(), xmlZahtev, this.getXmlHttpOptionsDocument());
  }

  private getUrl(): string {
     return this.autorskaPravaUrl + "/autorskaPrava";
  }

  public getXmlHttpOptionsDocument() {
    return {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Authorization': localStorage.getItem('token') || 'authkey',
        'Content-Type': 'application/xml',
      }),
      responseType: 'document' as 'json'
    };
  }

  private getDetaljiOZahtevuUrl(): string {
     return this.autorskaPravaUrl + "/autorskaPravaResenje/resenjeZahteva";

  }

  private getObradiZahtevUrl(): string {
      return this.autorskaPravaUrl + "/autorskaPravaResenje/obradiZahtev";


  }

  obradiZahtev(obradaZahteva: ObradaZahtevaDTO ):  Observable<Blob>  {
    const xmlZahtev = JsonToXML.parse("obradaZahteva", obradaZahteva);
    let obradaZahtevaPath = this.getObradiZahtevUrl();
    console.log(obradaZahtevaPath)
    return this.http.post<Blob>(obradaZahtevaPath, xmlZahtev, AuthService.getHttpOptions());
  }

  public downloadResenje(brojPrijave: string): Observable<Blob> {
    const xmlZahtev = JsonToXML.parse("brojPrijave", {'broj': brojPrijave});
    return this.http.post<Blob>(this.getResenjeUrl(), xmlZahtev, this.getDownloadHttpOptions());
  }

  public downloadPDF(brojPrijave: string): Observable<Blob> {
    const xmlZahtev = JsonToXML.parse("brojPrijave", {'broj': brojPrijave});
    return this.http.post<Blob>(this.getUrl() + "/download/pdf", xmlZahtev, this.getDownloadHttpOptions());
  }

  public downloadHTML(brojPrijave: string): Observable<Blob> {
    const xmlZahtev = JsonToXML.parse("brojPrijave", {'broj': brojPrijave});
    return this.http.post<Blob>(this.getUrl() + "/download/html", xmlZahtev, this.getDownloadHttpOptions());
  }

  public downloadRDF(brojPrijave: string): Observable<Blob> {
    const xmlZahtev = JsonToXML.parse("brojPrijave", {'broj': brojPrijave});
    return this.http.post<Blob>(this.getUrl() + "/download/rdf", xmlZahtev, this.getDownloadHttpOptions());
  }

  public downloadJSON(brojPrijave: string): Observable<Blob> {
    const xmlZahtev = JsonToXML.parse("brojPrijave", {'broj': brojPrijave});
    return this.http.post<Blob>(this.getUrl() + "/download/json", xmlZahtev, this.getDownloadHttpOptions());
  }

  public generisiIzvestaj(start: string, end: string, vrstaDokumenta: string): Observable<Blob> {
    const xmlZahtev = JsonToXML.parse("izvestajRequest", {'start': start, 'end': end});
    return this.http.post<Blob>(this.getUrl() + "/download/izvestaj", xmlZahtev, this.getDownloadHttpOptions());
  }

  public getDownloadHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Authorization': localStorage.getItem('token') || 'authkey',
        'Content-Type': 'application/xml',
      }),
      responseType: 'blob' as 'json'
    };
  }


  public searchByText(textSearchParams: TextSearchDTO): Observable<Zahtev> {
    const xmlZahtev = JsonToXML.parse("TextSearchDTO", textSearchParams);
    return this.http.put<Zahtev>(this.getUrl() + "/text-search", xmlZahtev, this.getXmlHttpOptions());
  }

  public searchByMetadata(metaParams: MetadataSearchParamsDTO): Observable<Zahtev> {
    const xmlZahtev = JsonToXML.parse("MetadataSearchParamsDTO", metaParams);
    return this.http.put<Zahtev>(this.getUrl() + "/metadata-search", xmlZahtev, this.getXmlHttpOptions());
  }

  public getXmlHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Authorization': localStorage.getItem('token') || 'authkey',
        'Content-Type': 'application/xml',
      }),
      responseType: 'document' as 'json'
    };
  }

  private getResenjeUrl(): string {
 return this.autorskaPravaUrl + "/autorskaPravaResenje/resenje";
 
  }
}
