import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import { AutorskaPravaComponent } from './pages/autorska-prava/autorska-prava.component';
import { SearchComponent } from './pages/search/search.component';



const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'autorska-prava', component: AutorskaPravaComponent},
  {path: 'search', component: SearchComponent},

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
