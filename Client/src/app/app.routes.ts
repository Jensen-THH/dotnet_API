import { Routes } from '@angular/router';
import { LoginComponent } from './layout/login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './layout/register/register.component';
import { AccountComponent } from './pages/account/account.component';
import { authGuard } from './guard/auth.guard';
import { UsersComponent } from './pages/users/users.component';
import { ServicesComponent } from './pages/services/services.component';
import { RolesComponent } from './pages/roles/roles.component';
import { CalendarComponent } from './pages/calendar/calendar.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: "calendar"
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'users',
        component: UsersComponent,
    },
    {
        path: 'account',
        component: AccountComponent,
        canActivate: [authGuard]
    },
    {
        path: 'roles',
        component: RolesComponent,
        canActivate: [authGuard]
    },
    {
        path: 'services',
        component: ServicesComponent,
        canActivate: [authGuard]
    },
    {
        path: 'calendar',
        component: CalendarComponent,
    },
    {
        path: "**",
        pathMatch: 'full',
        redirectTo: "home"
    },
];
