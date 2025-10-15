import {Component, Input} from '@angular/core';
import {Zahtev} from "../../model/shared/Zahtev";
import {MatDialog} from "@angular/material/dialog";
import {DetailsComponent} from "../details/details.component";

@Component({
  selector: 'app-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.css']
})
export class RequestCardComponent {
  @Input() zahtev: Zahtev;

  constructor(private dialog: MatDialog) {
    console.log(this.zahtev)
  }

  detaljiOZahtevu(brojPrijave: string, obradjen: boolean) {
    let dialogRef = this.dialog.open(DetailsComponent, {
      width: '400px'
    });
    dialogRef.componentInstance.brojPrijave = brojPrijave;
    dialogRef.componentInstance.obradjen = obradjen;
  }
}
