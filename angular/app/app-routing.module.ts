
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as usr from './users/index';
import * as prj from './projects/index';


const routes: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full'},
    { path: 'dashboard', component: prj.DashboardComponent },
    { path: 'projects', component: prj.ProjectsComponent },
    { path: 'project/:id', component: prj.ProjectDetailComponent },
    { path: 'tasks', component: prj.TasksComponent },
    { path: 'resources', component: prj.ResourcesComponent },
    { path: 'deliverables', component: prj.DeliverablesComponent },
    { path: 'staff', component: prj.StaffComponent },
    { path: 'new-project', component: prj.NewProjectComponent },
    { path: 'edit-project/:id', component: prj.NewProjectComponent },
    { path: 'users', component: usr.UsersComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
