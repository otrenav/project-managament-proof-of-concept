
import 'rxjs/add/operator/toPromise';

import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Project,
         Base,
         Task,
         Resource,
         Deliverable,
         Staff }         from './model'
import { User } from '../../users/index';


@Injectable()
export class NewProjectService {

    private url = 'projects/';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {}

    save(user: User, form: any, projectID: number): Promise <string> {
        let project = this.extractProjectInformation(form, projectID);
        return this.sendToBackend(user, project)
            .then(response => { return response; });
    }

    getFullProject(id: number): Promise <any> {
        let url = this.url + 'full-project/' + id + '/?format=json';
        return this.http
            .get(url)
            .toPromise()
            .then(response => { return response.json(); });
    }

    sendToBackend(user: User, project: Project): Promise <string> {
        let securedHeaders = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + user.token
        });
        return this.http
            .post(
                this.url + 'save/?format=json',
                JSON.stringify({
                    project: project,
                    username: user.username
                }),
                { headers: securedHeaders }
            )
            .toPromise()
            .then(response => { return "OK"; })
            .catch(response => { return "Invalid form, please review it."; });
    }

    extractProjectInformation(form: any, projectID: number): Project {
        let project: Project = new Project();
        project.id = projectID;
        project.base = this.extractBase(form.base);
        project.tasks = this.extractTasks(form.tasks);
        project.resources = this.extractResources(form.resources);
        project.deliverables = this.extractDeliverables(form.deliverables);
        project.staffs = this.extractStaffs(form.staffs);
        return project;
    }

    extractBase(obj: any): Base {
        let base: Base = new Base('', '', '');
        base.name = obj.name;
        base.objective = obj.objective;
        base.background = obj.background;
        return base;
    }

    extractTasks(array: any): Task[] {
        let tasks: Task[] = [];
        for (let i = 0; i < array.length; i++) {
            tasks.push({
                name: array[i].name,
                start: array[i].start,
                end: array[i].end
            });
        }
        return tasks;
    }

    extractResources(array: any): Resource[] {
        let resources: Resource[] = [];
        for (let i = 0; i < array.length; i++) {
            resources.push({
                task: array[i].task,
                details: array[i].details,
                justification: array[i].justification
            });
        }
        return resources;
    }

    extractDeliverables(array: any): Deliverable[] {
        let deliverables: Deliverable[] = [];
        for (let i = 0; i < array.length; i++) {
            deliverables.push({
                description: array[i].description,
            });
        }
        return deliverables;
    }

    extractStaffs(array: any): Staff[] {
        let staffs: Staff[] = [];
        for (let i = 0; i < array.length; i++) {
            staffs.push({
                user: array[i].user,
                task: array[i].task,
                role: array[i].role,
                hours: array[i].hours
            });
        }
        return staffs;
    }

    private handleError(error: any): Promise <any> {
        console.error('An error ocurred:', error);
        return Promise.reject(error.message || error);
    }
}
