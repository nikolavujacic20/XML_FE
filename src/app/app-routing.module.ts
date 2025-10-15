import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import { AutorskaPravaComponent } from './pages/autorska-prava/autorska-prava.component';



const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'autorska-prava', component: AutorskaPravaComponent},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
