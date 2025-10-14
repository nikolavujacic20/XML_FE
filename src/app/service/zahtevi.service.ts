import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import * as JsonToXML from "js2xmlparser";
import {RequestDetails , RequestProcessingDTO , Request} from "../model/shared/Zahtev";
import {MetadataSearchParamsDTO, TextSearchDTO} from "../model/search/SearchParams";

@Injectable({
  providedIn: 'root'
})
export class ZahteviService {

  private readonly autorskaPravaUrl: string;
  private readonly patentiUrl: string;
  private readonly zigoviUrl: string;

  constructor(private http: HttpClient) {
    this.patentiUrl = 'http://localhost:8000';
    this.autorskaPravaUrl = 'http://localhost:8001';
    this.zigoviUrl = 'http://localhost:8002';
  }

  public getDetaljiOObradi(brojPrijave: string | null): Observable<any> {
    const xmlZahtev = JsonToXML.parse("brojPrijave", {'broj': brojPrijave});
    return this.http.post<any>(this.getDetaljiOZahtevuUrl(brojPrijave), xmlZahtev, this.getXmlHttpOptionsDocument());
  }

  private getUrl(endpointChar: string | null): string {
    if (endpointChar == null) return "";
    switch (endpointChar.at(0)) {
      case "A":
        return this.autorskaPravaUrl + "/autorskaPrava";
      case "P":
        return this.patentiUrl + "/patent";
      default:
        return this.zigoviUrl + "/zig";
    }
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

  private getDetaljiOZahtevuUrl(endpointChar: string | null): string {
    if (endpointChar == null) return "";
    switch (endpointChar.at(0)) {
      case "A":
        return this.autorskaPravaUrl + "/autorskaPravaResenje/resenjeZahteva";
      case "P":
        return this.patentiUrl + "/patentResenje/resenjeZahteva";
      default:
        return this.zigoviUrl + "/zigResenje/resenjeZahteva";
    }
  }

  private getObradiZahtevUrl(endpointChar: string | null): string {
    if (endpointChar == null) return "";
    switch (endpointChar.at(0)) {
      case "A":
        return this.autorskaPravaUrl + "/autorskaPravaResenje/obradiZahtev";
      case "P":
        return this.patentiUrl + "/patentResenje/obradiZahtev";
      default:
        return this.zigoviUrl + "/zigResenje/obradiZahtev";
    }
  }

  obradiZahtev(obradaZahteva: RequestProcessingDTO ):  Observable<Blob>  {
    const xmlZahtev = JsonToXML.parse("obradaZahteva", obradaZahteva);
    console.log(xmlZahtev);
    console.log(this.getObradiZahtevUrl(obradaZahteva.applicationNumber))
    let obradaZahtevaPath = this.getObradiZahtevUrl(obradaZahteva.applicationNumber);
    console.log(obradaZahtevaPath)
    return this.http.post<Blob>(obradaZahtevaPath, xmlZahtev, AuthService.getHttpOptions());
  }

  public downloadResenje(brojPrijave: string): Observable<Blob> {
    const xmlZahtev = JsonToXML.parse("brojPrijave", {'broj': brojPrijave});
    return this.http.post<Blob>(this.getResenjeUrl(brojPrijave), xmlZahtev, this.getDownloadHttpOptions());
  }

  public downloadPDF(brojPrijave: string): Observable<Blob> {
    const xmlZahtev = JsonToXML.parse("brojPrijave", {'broj': brojPrijave});
    return this.http.post<Blob>(this.getUrl(brojPrijave) + "/download/pdf", xmlZahtev, this.getDownloadHttpOptions());
  }

  public downloadHTML(brojPrijave: string): Observable<Blob> {
    const xmlZahtev = JsonToXML.parse("brojPrijave", {'broj': brojPrijave});
    return this.http.post<Blob>(this.getUrl(brojPrijave) + "/download/html", xmlZahtev, this.getDownloadHttpOptions());
  }

  public downloadRDF(brojPrijave: string): Observable<Blob> {
    const xmlZahtev = JsonToXML.parse("brojPrijave", {'broj': brojPrijave});
    return this.http.post<Blob>(this.getUrl(brojPrijave) + "/download/rdf", xmlZahtev, this.getDownloadHttpOptions());
  }

  public downloadJSON(brojPrijave: string): Observable<Blob> {
    const xmlZahtev = JsonToXML.parse("brojPrijave", {'broj': brojPrijave});
    return this.http.post<Blob>(this.getUrl(brojPrijave) + "/download/json", xmlZahtev, this.getDownloadHttpOptions());
  }

  public generisiIzvestaj(start: string, end: string, vrstaDokumenta: string): Observable<Blob> {
    const xmlZahtev = JsonToXML.parse("izvestajRequest", {'start': start, 'end': end});
    return this.http.post<Blob>(this.getUrl(vrstaDokumenta) + "/download/izvestaj", xmlZahtev, this.getDownloadHttpOptions());
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

  private getXMLHttpOptions(): Object {
    return {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Authorization': localStorage.getItem('token') || 'authkey',
        'Content-Type': 'application/xml',
      }),
      responseType: 'text' as 'json'
    };
  }

  public searchByText(textSearchParams: TextSearchDTO, endpointChar: string): Observable<Request> {
    const xmlZahtev = JsonToXML.parse("TextSearchDTO", textSearchParams);
    return this.http.put<Request>(this.getUrl(endpointChar) + "/text-search", xmlZahtev, this.getXmlHttpOptions());
  }

  public searchByMetadata(metaParams: MetadataSearchParamsDTO, endpointChar: string): Observable<Request> {
    const xmlZahtev = JsonToXML.parse("MetadataSearchParamsDTO", metaParams);
    return this.http.put<Request>(this.getUrl(endpointChar) + "/metadata-search", xmlZahtev, this.getXmlHttpOptions());
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

  private getResenjeUrl(endpointChar: string | null): string {
    if (endpointChar == null) return "";
    switch (endpointChar.at(0)) {
      case "A":
        return this.autorskaPravaUrl + "/autorskaPravaResenje/resenje";
      case "P":
        return this.patentiUrl + "/patentResenje/resenje";
      default:
        return this.zigoviUrl + "/zigResenje/resenje";
    }
  }
}
