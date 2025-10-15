import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ZahteviService} from "../../service/zahtevi.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-generate-reports-dialog',
  templateUrl: './generate-reports-dialog.component.html',
  styleUrls: ['./generate-reports-dialog.component.css']
})
export class GenerateReportsDialogComponent {
  pocetak: Date = new Date();
  kraj: Date = new Date();
  dateRange = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });
  vrstaZahteva: string = "A";
  blob: Blob = new Blob();

  constructor(private servis: ZahteviService, private _snackBar: MatSnackBar) {
  }

  generisi() {
    let start = this.pocetak.toISOString().split('T')[0];
    let end = this.kraj.toISOString().split('T')[0];
    this.servis.generisiIzvestaj(start, end, this.vrstaZahteva).subscribe({
      next: (data) => this.downloadFile(data, 'izvestaj.pdf', 'pdf'),
      error: () => this.snack()
    });
  }

  downloadFile(data: Blob, fileName: string, applicationType: string) {
    this.blob = new Blob([data], {type: 'application/' + applicationType});
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = fileName;
    link.click();
  }

  private snack() {
    this._snackBar.open("Greška pri generisanju fajla.", '', {
      duration: 3000,
      panelClass: ['snack-bar']
    })
  }

}
