import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { DashboardAdmin } from './pages/dashboard-admin/dashboard-admin';
import { Users } from './pages/users/users';
import { Rooms } from './pages/rooms/rooms';
import { Doors } from './pages/doors/doors';
import { AccessLogs } from './pages/access-logs/access-logs'

export const routes: Routes = [
    
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    {
        path: 'dashboard-admin',
        component: DashboardAdmin
    },

    {   
        path: 'dashboard-staff',
        component: DashboardAdmin

    },

    {
        path: 'users',
        component: Users
    },

    {
        path: 'rooms',
        component: Rooms
    },

    {
        path: 'doors',
        component: Doors
    },   

    {
        path: 'access-logs',
        component: AccessLogs
    }
    

];
