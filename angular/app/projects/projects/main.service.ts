
import 'rxjs/add/operator/toPromise';

import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import { DetailProject } from './model';
import { UserService }   from '../../users/index';


@Injectable()
export class ProjectService {

    private url = 'projects/';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(
        private http: Http,
        private userService: UserService
    ) {}

    getProject(id: number): Promise <DetailProject> {
        let url = this.url + 'custom-projects/' + id + '/?format=json';
        return this.http
            .get(url)
            .toPromise()
            .then(response => {
                return this.buildDetailProject(response.json());
            })
            .catch(this.handleError);
    }

    buildDetailProject(json: any): DetailProject {
        return new DetailProject(
            json.id,
            json.name,
            json.state,
            json.state_text,
            json.objective,
            json.background,
            json.creator,
            json.recommenders,
            json.comments
        )
    }

    deleteProject(id: number): void {
        let url = this.url + 'projects/' + id + '/?format=json';
        this.http
            .delete(url, { headers: this.headers })
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }

    projectAction(id: number, action: string, form: any) {
        let url = this.url + 'action/' + id + '/?format=json';
        this.http
            .post(url, {
                headers: this.headers,
                action: action,
                comment: form.comment,
                username: this.userService.currentUser.username
            })
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise <any> {
        console.error('An error ocurred', error);
        return Promise.reject(error.message || error);
    }
}
