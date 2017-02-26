
import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { UserService }       from '../../users/index';
import { DashboardService }  from './main.service';


@Component({
    moduleId: module.id,
    selector: 'projects-app',
    templateUrl: 'main.component.html'
})
export class DashboardComponent implements OnInit {

    private tasks: any[];
    private activeProjects: any[];
    private submittedProjects: any[];
    private recommendedProjects: any[];
    private approvedProjects: any[];
    private deniedProjects: any[];

    constructor(
        private router: Router,
        private userService: UserService,
        private dashboardService: DashboardService
    ) {}

    ngOnInit(): void {
        let currentUsername = this.userService.currentUser.username;
        this.dashboardService
            .getTasks(currentUsername)
            .then(tasks => { this.tasks = tasks; });
        this.dashboardService
            .getActiveProjects(currentUsername)
            .then(projects => { this.activeProjects = projects; });
        this.dashboardService
            .getSubmittedProjects(currentUsername)
            .then(projects => { this.submittedProjects = projects; });
        this.dashboardService
            .getRecommendedProjects(currentUsername)
            .then(projects => { this.recommendedProjects = projects; });
        this.dashboardService
            .getApprovedProjects(currentUsername)
            .then(projects => { this.approvedProjects = projects; });
        this.dashboardService
            .getDeniedProjects(currentUsername)
            .then(projects => { this.deniedProjects = projects; });
    }

    tasksExist(): boolean {
        return this.tasks && this.tasks.length >= 1;
    }

    activeProjectsExist(): boolean {
        return this.activeProjects && this.activeProjects.length >= 1;
    }

    submittedProjectsExist(): boolean {
        return this.submittedProjects && this.submittedProjects.length >= 1;
    }

    recommendedProjectsExist(): boolean {
        return this.recommendedProjects && this.recommendedProjects.length >= 1;
    }

    approvedProjectsExist(): boolean {
        return this.approvedProjects && this.approvedProjects.length >= 1;
    }

    deniedProjectsExist(): boolean {
        return this.deniedProjects && this.deniedProjects.length >= 1;
    }

    projectDetails(id: number) {
        this.router.navigate(['project', id]);
    }

    showActiveProjects(): boolean {
        return (!(this.userService.currentUserIsCouncil() ||
                  this.userService.currentUserIsApprover()));
    }
}
