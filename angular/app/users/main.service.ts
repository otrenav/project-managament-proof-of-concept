
import 'rxjs/add/operator/toPromise';

import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router }        from '@angular/router';

import { CookieService } from 'angular2-cookie/core';

import { User }          from './model';


@Injectable()
export class UserService {

    public currentCookie: any;
    public currentUser: User;

    private url = 'users/';
    private passwordChangeUrl = 'admin/auth/user/'
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(
        private http: Http,
        private router: Router,
        private cookieService: CookieService,
    ) {}

    setCurrentUser(user: User): void {
        this.currentUser = user;
    }

    login(username: string, password: string): Promise <string> {
        return this.http
            .post(
                this.url + 'login/?format=json',
                {
                    headers: this.headers,
                    username: username,
                    password: password
                }
            )
            .toPromise()
            .then(response => {
                return this.buildUser(username, response.json().token)
                    .then(user => {
                        this.currentUser = user;
                        this.cookieService.putObject(
                            'innovation-lab-user',
                                <Object> this.currentUser
                        );
                        return 'OK';
                    })
            })
            .catch(error => {
                console.log(error);
                return 'Invalid credentials';
            });
    }

    newUser(username: string, password: string): Promise <string> {
        // NOTE: the only reason I've found so far that
        //       could create an error is the fact that the
        //       username already exists, but be careful
        return this.http
            .post(
                this.url + 'save/?format=json',
                JSON.stringify({username: username, password: password}),
                {headers: this.headers}
            )
            .toPromise()
            .then(response => { return 'OK'; })
            .catch(error => { return 'Username already exists'; });
    }

    getUsers(): Promise <any[]> {
        let getUserListUrl = this.url + 'get-user-list/?format=json';
        return this.http
            .get(getUserListUrl)
            .toPromise()
            .then(response => { return response.json(); })
            .catch(this.handleError);
    }

    changePassword(): void {
        let newPasswordUrl = this.passwordChangeUrl + this.currentUser.id;
        window.location.href = (newPasswordUrl + '/password/');
    }

    currentUserIsCouncil(): boolean {
        // NOTE: This group name is harcoded so if
        //       you use other group names, this
        //       should also change
        return this.userGroupChecker('Council');
    }

    currentUserIsApprover(): boolean {
        // NOTE: This group name is harcoded so if
        //       you use other group names, this
        //       should also change
        return this.userGroupChecker('Approvers');
    }

    userGroupChecker(group: string): boolean {
        if (this.userLoggedIn()) {
            for (let i = 0; i < this.currentUser.groups.length; i++) {
                if (this.currentUser.groups[i] == group) {
                    return true;
                }
            }
        }
        return false;
    }

    validateUser(): boolean {
        if (this.currentUser == null && !this.getUserFromCookie()) {
            this.router.navigate(['users']);
            return false;
        }
        return true;
    }

    getUserFromCookie(): boolean {
        let c: any = this.cookieService.getObject('innovation-lab-user');
        if (!(c == null)) {
            this.currentUser = new User(c.id, c.username, c.token, c.groups);
        }
        if (!(this.currentUser == null)) {
            return true;
        }
        return false;
    }

    logout(): void {
        this.deleteCookie();
        this.router.navigate(['users']);
    }

    deleteCookie(): void {
        this.cookieService.remove('innovation-lab-user');
    }

    private buildUser(username: string, token: string): Promise <User> {
        let getUserIdUrl = this.url + 'get-user-info/' + username + '/?format=json';
        return this.http
            .get(getUserIdUrl)
            .toPromise()
            .then(response => {
                return new User(
                    response.json().id,
                    username,
                    token,
                    response.json().groups
                );
            });
    }

    userLoggedIn(): boolean {
        return !(this.currentUser == null);
    }

    private handleError(error: any): Promise <any> {
        console.error('An error ocurred', error);
        return Promise.reject(error.message || error);
    }
}
