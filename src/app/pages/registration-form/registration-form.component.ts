import {Component, EventEmitter, inject, Output} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
})
export class RegistrationFormComponent {
  @Output() private readonly  switchForm = new EventEmitter();

  email: string = "";
  phoneNumber: string = "";
  password: string = "";
  password2: string = "";
  name: string = "";
  lastName: string = "";
  userRole: string = "GRADJANIN";

  hide: boolean = true;
  hide2: boolean = true;

  private readonly _snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);

  readonly phoneFormControl = new FormControl('', [Validators.required]);
  readonly emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  readonly nameFormControl = new FormControl('', [Validators.required]);
  readonly lastNameFormControl = new FormControl('', [Validators.required]);
  readonly passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  readonly password2FormControl = new FormControl('', [Validators.required]);

  registerNewUser() {
    this.authService.register({
      "email": this.email,
      "password": this.password,
      "name": this.name,
      "lastName": this.lastName,
      "phoneNumber": this.phoneNumber,
      "userRole": this.userRole
    }).subscribe({
      next: () => {
        this._snackBar.open("Registration successful!", '', {
          duration: 3000,
          panelClass: ['snack-bar']
        })
      },
      error: () => this._snackBar.open("Error occured. Please check your data.", '', {
        duration: 3000,
        panelClass: ['snack-bar']
      })
    });
  }

  switchToLoginForm() {
    this.switchForm.emit();
  }
}
