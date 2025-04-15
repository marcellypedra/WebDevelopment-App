import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RosterComponent } from './pages/roster/roster.component';
import { UsersComponent } from './pages/users/users.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ShiftsComponent } from './pages/shifts/shifts.component';
import { AuthGuard } from './guard/auth.guard';
import { ManagerGuard } from './guard/manager.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard, ManagerGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard, ManagerGuard] },
  { path: 'roster', component: RosterComponent, canActivate: [AuthGuard] },
  {path: 'shifts', component: ShiftsComponent, canActivate:[AuthGuard, ManagerGuard]},
  { path: '**', redirectTo: '/login' }, // @@ Keep as the last.
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
