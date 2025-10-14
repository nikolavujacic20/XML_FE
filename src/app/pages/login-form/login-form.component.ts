import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoginResponseDto, UserTokenState} from "../../model/shared/LoginResponseDto";


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  private readonly _snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);


  @Output() private readonly switchForm = new EventEmitter();

  readonly emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  readonly passwordFormControl = new FormControl('', [Validators.required]);

  hide = true;

  email = "";
  password = "";

  switchToRegisterForm() {
    this.switchForm.emit();
  }

  login() {
    this.authService.login({
      "email": this.email,
      "password": this.password
    }).subscribe({
      next: (data:any) => {
        const loginResponseDTO:LoginResponseDto = this.parseLoginResponse(data);
        localStorage.setItem('token', "Bearer " + loginResponseDTO.token.accessToken);
        this.router.navigate(['/home']);
      },
      error: () => this._snackBar.open("Wrong email or password.", '', {
        duration: 3000,
        panelClass: ['snack-bar']
      })
    });
  }

  parseLoginResponse(data: any) {
    const loginResponseDTO:LoginResponseDto = new LoginResponseDto();
    loginResponseDTO.token = new UserTokenState();
    loginResponseDTO.token.accessToken = data.getElementsByTagName("accessToken")[0].textContent;
    loginResponseDTO.token.expiresIn = data.getElementsByTagName("expiresIn")[0].textContent;
    loginResponseDTO.userRole = data.getElementsByTagName("userRole")[0].textContent;

    return loginResponseDTO;
  }
}
