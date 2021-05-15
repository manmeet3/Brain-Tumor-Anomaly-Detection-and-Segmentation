import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardRadiologistComponent } from './board-radiologist/board-radiologist.component';
import { BoardTechnicianComponent } from './board-tecnician/board-technician.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NiftiComponent } from './nifti/nifti.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { TableComponent } from './table/table.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'technician', component: BoardTechnicianComponent },
  { path: 'table', component: TableComponent},
  { path: 'radiologist', component: BoardRadiologistComponent },
  { path: 'admin', component: BoardAdminComponent },
  { path: 'nifti', component: NiftiComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
