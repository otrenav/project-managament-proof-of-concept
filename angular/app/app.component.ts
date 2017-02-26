
import { Event, Router, NavigationEnd } from '@angular/router';
import { Component, OnInit }            from '@angular/core';

import { UserService }                  from './users/index';


@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

    private loggedIn: boolean = false;;

    constructor(
        private router: Router,
        private userService: UserService
    ) {
        router.events.subscribe((event) => {
            if(event instanceof NavigationEnd ){
                if (event.url.indexOf("/dashboard") !== -1   ||
                    event.url.indexOf("/new-project") !== -1 ||
                    event.url.indexOf("/edit-project") !== -1 ||
                    event.url.indexOf("/project") !== -1) {
                    if (this.userService.validateUser()) {
                        this.loggedIn = true;
                    } else {
                        this.loggedIn = false;
                    }
                } else {
                    this.loggedIn = false;
                }
            }
        });
    }

    ngOnInit(): void {
        this.userService.validateUser();
    }

    logout(): void {
        this.userService.logout();
    }
}
