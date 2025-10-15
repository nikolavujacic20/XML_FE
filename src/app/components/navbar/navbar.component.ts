import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  role: string = "GRADJANIN";

  constructor(private route: Router, private dialog: MatDialog, private authService: AuthService) {
    this.authService.getCurrentlyLoggedUser().subscribe((data: any) => {
      this.role = data.getElementsByTagName("role")[0].textContent;
    });
  }

  goToPage(page: string) {
    this.route.navigate([page]);
  }

  logout() {
    localStorage.clear();
    this.goToPage("/");
  }


}
