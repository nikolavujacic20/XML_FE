import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginResponseDto, UserTokenState} from "../model/shared/LoginResponseDto";
import {Observable} from "rxjs";
import {LoginCredentials} from "../model/shared/LoginCredentials";
import {RegisterCredentials} from "../model/shared/RegisterCredentials";
import {User} from "../model/shared/User";
import * as JsonToXML from "js2xmlparser";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly authUrl='http://localhost:8003/auth';;

  constructor(private http: HttpClient) {}
  

  public login(user: LoginCredentials): Observable<any> {
    let body = {
      "email": user.email,
      "password": user.password
    }
    const xmlZahtev = JsonToXML.parse("authenticationRequest", body);
    return this.http.post<any>(this.authUrl + '/login', xmlZahtev, AuthService.getXmlHttpOptions());
  }

  public register(user: RegisterCredentials): Observable<string> {
    const xmlZahtev = JsonToXML.parse("userDTO", user);
    return this.http.post<string>(this.authUrl + '/register', xmlZahtev, AuthService.getHttpOptions());
  }

  public getCurrentlyLoggedUser(): Observable<any> {
    return this.http.get<any>(this.authUrl + '/currently-logged-user', AuthService.getXmlHttpOptions());
  }

  public static getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Authorization': localStorage.getItem('token') || 'authkey',
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
      })
    };
  }

  public static getNoContentTypeHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Authorization': localStorage.getItem('token') || 'authkey',
      })
    };
  }

  public static getXmlHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Authorization': localStorage.getItem('token') || 'authkey',
        'Content-Type': 'application/xml',
      }),
      responseType: 'document' as 'json'
    };
  }

}
