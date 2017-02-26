
import './rxjs-extensions';

import { NgModule }                         from '@angular/core';
import { RouterModule }                     from '@angular/router';
import { BrowserModule }                    from '@angular/platform-browser';
import { HttpModule }                       from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CookieService }                    from 'angular2-cookie/services/cookies.service';
import { AppComponent }                     from './app.component';
import { AppRoutingModule }                 from './app-routing.module';
import * as prj                             from './projects/index';
import * as usr                             from './users/index';


@NgModule({
    imports: [
        HttpModule,
        BrowserModule,
        ReactiveFormsModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        prj.ProjectsComponent,
        prj.ProjectDetailComponent,
        prj.TasksComponent,
        prj.ResourcesComponent,
        prj.DeliverablesComponent,
        prj.StaffComponent,
        prj.DashboardComponent,
        prj.NewProjectComponent,
        usr.UsersComponent
    ],
    providers: [
        prj.NewProjectService,
        prj.DashboardService,
        prj.ProjectService,
        usr.UserService,
        CookieService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {}
