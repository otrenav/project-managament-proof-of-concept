
import 'rxjs/add/operator/toPromise';

import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';


@Injectable()
export class DashboardService {

    private url = 'projects/';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {}

    getTasks(username: string): Promise <any[]> {
        let url = this.url + 'assigned-tasks/' + username + '/?format=json';
        return this.getUrl(url)
    }

    getActiveProjects(username: string): Promise <any[]> {
        let url = this.url + 'active-projects/' + username + '/?format=json';
        return this.getUrl(url)
    }

    getSubmittedProjects(username: string): Promise <any[]> {
        let url = this.url + 'submitted-projects/' + username + '/?format=json';
        return this.getUrl(url)
    }

    getRecommendedProjects(username: string): Promise <any[]> {
        let url = this.url + 'recommended-projects/' + username + '/?format=json';
        return this.getUrl(url)
    }

    getApprovedProjects(username: string): Promise <any[]> {
        let url = this.url + 'approved-projects/' + username + '/?format=json';
        return this.getUrl(url)
    }

    getDeniedProjects(username: string): Promise <any[]> {
        let url = this.url + 'denied-projects/' + username + '/?format=json';
        return this.getUrl(url)
    }

    getUrl(url: string): Promise <any[]> {
        return this.http
            .get(url)
            .toPromise()
            .then(response => { return response.json(); })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise <any> {
        console.error('An error ocurred', error);
        return Promise.reject(error.message || error);
    }
}
