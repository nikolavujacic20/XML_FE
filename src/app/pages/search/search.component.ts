import {Component} from '@angular/core';
import {MetadataSearchParamsDTO, TextSearchDTO} from "../../model/search/SearchParams";
import {ZahteviService} from "../../service/zahtevi.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../service/auth.service";
import { Zahtev } from 'src/app/model/shared/Zahtev';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  autorskaPravaPossibleMetadata: string[] = ["Broj prijave", "Naslov", "Email podnosioca prijave", "Vrsta autorskog dela"];
  sviMetapodaci: string[] = this.autorskaPravaPossibleMetadata;

  tip = ['Pretraga','Napredna pretraga']

  trenuniTip = this.tip[0];





  autorskaPravaMetadataMapper = {
    "Broj prijave": "broj_prijave",
    "Naslov": "naslov",
    "Email podnosioca prijave": "podnosilac_email",
    "Vrsta autorskog dela": "vrsta_autorskog_dela",
  }


  metadataMapper: any = this.autorskaPravaMetadataMapper;

  simpleSearchText: string = "";
  metapodaci: MetadataSearchParamsDTO[] = [];
  rezultatiPretrage: Zahtev[] = [];
  fifthIndexesOfResults = [0];
  searched = false;
  selected: string = "A";
  vrstaZahteva: string = "A";
  statusZahteva: string = "prihvaceni";
  matchCase: boolean = false;

  role: string = "GRADJANIN";

  constructor(private zahteviService: ZahteviService, private _snackBar: MatSnackBar, private authService: AuthService) {
    this.authService.getCurrentlyLoggedUser().subscribe((data: any) => {
      this.role = data.getElementsByTagName("role")[0].textContent;
    });
  }

  removeMeta(i: number) {
    this.metapodaci.splice(i, 1);
  }

  addMeta() {
    let metadata = new MetadataSearchParamsDTO();
    metadata.operator = "AND";
    this.metapodaci.push(new MetadataSearchParamsDTO());
  }

  searchText() {
    this.rezultatiPretrage = [];
    let textSearchParams: TextSearchDTO = new TextSearchDTO();
    textSearchParams.textSearch = this.simpleSearchText.trim();
    textSearchParams.status = this.statusZahteva;
    textSearchParams.casesensitive = this.matchCase;

    this.zahteviService.searchByText(textSearchParams).subscribe(data => {
      this.rezultatiPretrage = this.parseSimpleZahtevsDoc(data);
      this.searched = true;
    });
  }

  searchMeta() {
    if (!this.validateMeta()) {
      this._snackBar.open("Metadata not valid.", '', {
        duration: 3000,
        panelClass: ['snack-bar']
      })
      return;
    }

    this.rezultatiPretrage = [];
    let metapodaciForSearch: MetadataSearchParamsDTO[] = this.mapVisibleMetadataNamesToFunctional();
    let metaParams: MetadataSearchParamsDTO = this.mapMetadataParamsToOneInstance(metapodaciForSearch);
    metaParams.status = this.statusZahteva;
    this.zahteviService.searchByMetadata(metaParams).subscribe(data => {
      this.rezultatiPretrage = this.parseSimpleZahtevsDoc(data);
      this.searched = true;
    });
  }

  mapVisibleMetadataNamesToFunctional() {
    let metapodaciForSearch: MetadataSearchParamsDTO[] = JSON.parse(JSON.stringify(this.metapodaci))
    for (let meta of metapodaciForSearch) {
      meta.property = this.metadataMapper[meta.property];
    }
    return metapodaciForSearch;
  }

  mapMetadataParamsToOneInstance(metapodaciForSearch: MetadataSearchParamsDTO[]) {
    let m: MetadataSearchParamsDTO = new MetadataSearchParamsDTO();
    m.property = "";
    m.value = "";
    m.operator = "";

    for (let mp of metapodaciForSearch) {
      m.property += "|" + mp.property;
      m.value += "|" + mp.value;
      m.operator += "|" + mp.operator;
    }

    m.property = m.property.slice(1);
    m.value = m.value.slice(1);
    m.operator = m.operator.slice(1);

    return m;
  }

  setFifthIndexes(len: number) {
    this.fifthIndexesOfResults = [];
    for (let i = 0; i < len; i += 5) {
      this.fifthIndexesOfResults.push(i);
    }
  }

  validateTextSearch() {
    return !(this.simpleSearchText === null || this.simpleSearchText.trim() === "");
  }

  validateMeta() {
    for (let metaParam of this.metapodaci) {
      if (metaParam.property === null || metaParam.value === null || metaParam.operator === null
        || metaParam.property.trim() === "" || metaParam.value.trim() === "") {
        return false;
      }
    }
    return this.metapodaci.length != 0;
  }

  resetChosenParamsAndResultsAndPutPropperPossibleMetadata() {
    this.rezultatiPretrage = [];
    this.metapodaci = [];
    this.searched = false;

 
      this.sviMetapodaci = this.autorskaPravaPossibleMetadata;
      this.metadataMapper = this.autorskaPravaMetadataMapper;
   
  }

  parseSimpleZahtevsDoc(data: any) {
    let simpleZahtevs: Zahtev[] = [];
    let simpleZahtevsDoc = data.getElementsByTagName("item"); // #document is a <List> of <item>s containing data from back [0].textContent;

    for (let simpleZahtevDoc of simpleZahtevsDoc) {
      let brojPrijaveSimpleZahtev: string = simpleZahtevDoc.getElementsByTagName("brojPrijave")[0].textContent;
      let datumPodnosenjaSimpleZahtev: string = simpleZahtevDoc.getElementsByTagName("datumPodnosenja")[0].textContent;
      let podnosiocSimpleZahtev = simpleZahtevDoc.getElementsByTagName("podnosiocEmail")[0].textContent;
      let obradjenSimpleZahtev: boolean = simpleZahtevDoc.getElementsByTagName("obradjen")[0].textContent === "true";

      let simpleZahtev = new Zahtev();
      simpleZahtev.brojPrijave = brojPrijaveSimpleZahtev;
      simpleZahtev.datumPodnosenja = datumPodnosenjaSimpleZahtev;
      simpleZahtev.podnosiocEmail = podnosiocSimpleZahtev;
      simpleZahtev.obradjen = obradjenSimpleZahtev;

      simpleZahtevs.push(simpleZahtev);
      console.log(simpleZahtev);
    }

    return simpleZahtevs;
  }
}
