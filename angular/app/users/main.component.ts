
import { Router }            from '@angular/router';
import { OnInit,
         Component }         from '@angular/core';
import { FormBuilder,
         FormGroup }         from '@angular/forms';

import { UserService }       from './main.service';
import { User }              from './model';


@Component({
    moduleId: module.id,
    selector: 'users',
    templateUrl: 'main.component.html'
})
export class UsersComponent implements OnInit {

    private form: FormGroup;
    private success: boolean;
    private message: string = '';
    private activeTab: string = 'login';

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private service: UserService
    ) {
        this.form = this.fb.group({username: '', password: ''});
    }

    ngOnInit(): void {
        this.logout();
    }

    logout(): void {
        this.service.setCurrentUser(null);
    }

    login(): void {
        this.service
            .login(
                this.form.value.username,
                this.form.value.password
            )
            .then(message => {
                if (message === 'OK') {
                    this.message = '';
                    this.router.navigate(['/dashboard']);
                } else {
                    this.success = false;
                    this.message = message
                }
            });
    }

    newUser(): void {
        this.service
            .newUser(
                this.form.value.username,
                this.form.value.password
            )
            .then(message => {
                if (message == 'OK') {
                    this.success = true;
                    this.message = 'Successfully created user'
                } else {
                    this.success = false;
                    this.message = message;
                }
                this.activeTab = 'login'
            });
    }

    changePassword(): void {
        this.service.changePassword();
    }

    activateTab(tab: string): void {
        this.message = '';
        this.activeTab = tab;
    }

    isTabActive(tab: string): boolean {
        return(this.activeTab == tab);
    }
}
