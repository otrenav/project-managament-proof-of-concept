
import { Component,
         Input,
         OnInit,
         DoCheck }        from '@angular/core';
import { ActivatedRoute,
         Router,
         Params }         from '@angular/router';
import { FormBuilder,
         FormGroup,
         FormControl }    from '@angular/forms';
import { UserService }    from '../../users/index';

import { ProjectService } from './main.service';
import { DetailProject }  from './model';

declare var SimpleMDE: any;

const PROGRESS_CHOICES: any = {
    IN_PROGRESS: 1,
    SUBMITTED: 2,
    RECOMMENDED: 3,
    APPROVED: 4,
    DENIED: 5
}


@Component({
    moduleId: module.id,
    selector: 'project-detail',
    templateUrl: 'detail.component.html'
})
export class ProjectDetailComponent implements OnInit, DoCheck {

    // NOTE: We need a null object to avoid problems
    //       at the beginning when rendering the site
    //       It will almost instantly be filled with
    //       the correct information
    // @Input()
    selectedProject: DetailProject = new DetailProject(
        0, '', 0, '', '', '', '', [''], ['']
    );

    private form: FormGroup;

    objectiveMarkdown: any;
    backgroundMarkdown: any;
    commentMarkdown: any;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private userService: UserService,
        private projectService: ProjectService
    ) {}

    ngOnInit(): void {
        if (!this.userService.userLoggedIn()) {
            this.router.navigate(['users']);
        } else {
            this.route.params.forEach((params: Params) => {
                this.projectService.getProject(<number> params['id'])
                    .then(detailProject => {
                        this.selectedProject = detailProject;
                        this.loadMarkdown();
                    });
            });
        }
        this.buildForm();
    }

    ngDoCheck() {
        this.extractMarkdown();
    }

    buildForm(): void {
        this.form = this.fb.group({
            comment: ''
        });
    }

    loadMarkdown(): void {
        this.objectiveMarkdown = new SimpleMDE({
            element: document.getElementById("objectiveMarkdownID"),
            status: false,
            toolbar: false
        });
        this.backgroundMarkdown = new SimpleMDE({
            element: document.getElementById("backgroundMarkdownID"),
            status: false,
            toolbar: false
        });
        this.commentMarkdown = new SimpleMDE({
            element: document.getElementById("commentMarkdownID"),
            satus: false,
            toolbar: false
        });
        this.objectiveMarkdown.value(this.selectedProject.objective);
        this.backgroundMarkdown.value(this.selectedProject.background);
        this.objectiveMarkdown.togglePreview();
        this.backgroundMarkdown.togglePreview();
    }

    editProject(id: number): void {
        this.router.navigate(['edit-project', id]);
    }

    deleteProject(id: number): void {
        this.projectService.deleteProject(id);
        this.router.navigate(['dashboard']);
    }

    comment(id: number): void {
        this.projectAction(id, 'Comment');
    }

    commentAndSubmit(id: number): void {
        this.projectAction(id, 'Submit');
    }

    commentAndRecommend(id: number): void {
        this.projectAction(id, 'Recommend');
    }

    commentAndApprove(id: number): void {
        this.projectAction(id, 'Approve');
    }

    commentAndReturn(id: number): void {
        this.projectAction(id, 'Return');
    }

    commentAndDeny(id: number): void {
        this.projectAction(id, 'Deny');
    }

    projectAction(id: number, action: string): void {
        this.projectService.projectAction(id, action, this.form.value);
        this.router.navigate(['dashboard']);
    }

    isOpenable(): boolean {
        // NOTE: Current assumption is that every one who
        //       can see a project can also open it (the
        //       permissions setting for editability happends
        //       on the initialization of the project's form)
        return true;
    }

    isDeletable(): boolean {
        // NOTE: Current assumption is that every one who
        //       can see a project can also delete it
        return true;
    }

    isCommentable(): boolean {
        // NOTE: Current assumption is that every one who
        //       can see a project can also comment on it
        return true;
    }

    isSubmittable(): boolean {
        // NOTE: Current assumption is that only the project
        // owner should be able to submit the project, and
        // it should only be submittable if it is "In Progress"
        if ((this.currentUserIsCreator()) &&
            (this.selectedProject != null &&
             this.selectedProject.state === PROGRESS_CHOICES.IN_PROGRESS)) {
            return true;
        }
        return false;
    }

    isRecommendable(): boolean {
        // NOTE: Current assumption is that only members of
        //       the council group can recommend projects,
        //       and it should only be recommendable if
        //       it has been submitted
        return ((this.userService.currentUserIsCouncil()) &&
                (!this.currentUserHasRecommended()) &&
                (this.selectedProject != null &&
                 this.selectedProject.state === PROGRESS_CHOICES.SUBMITTED));
    }

    isApprovable(): boolean {
        // NOTE: Current assumption is that only members of
        //       the approver group can approve projects,
        //       and it can only be approved if the project
        //       has been recommended by the council
        return ((this.userService.currentUserIsApprover()) &&
                (this.selectedProject != null &&
                 this.selectedProject.state === PROGRESS_CHOICES.RECOMMENDED));
    }

    isReturnable(): boolean {
        // NOTE: Current assumption is that only members of
        //       the Council or approver members can
        //       return a project (the owner is assumed to
        //       not be able to do so)
        return ((this.userService.currentUserIsCouncil() ||
                 this.userService.currentUserIsApprover()) &&
                (this.selectedProject != null &&
                 (this.selectedProject.state === PROGRESS_CHOICES.SUBMITTED ||
                  this.selectedProject.state === PROGRESS_CHOICES.RECOMMENDED)));
    }

    isDeniable(): boolean {
        // NOTE: Current assumption is that only members of
        //       the Council or approver members can
        //       deny a project (the owner is assumed to
        //       not be able to do so)
        return ((this.userService.currentUserIsCouncil() ||
                 this.userService.currentUserIsApprover()) &&
                (this.selectedProject != null &&
                 (this.selectedProject.state === PROGRESS_CHOICES.SUBMITTED ||
                  this.selectedProject.state === PROGRESS_CHOICES.RECOMMENDED)));
    }

    currentUserHasRecommended(): boolean {
        if (this.userService.userLoggedIn()) {
            for (let i = 0; i < this.selectedProject.recommenders.length; i++) {
                if (this.selectedProject.recommenders[i] ===
                    this.userService.currentUser.username) {
                    return true;
                }
            }
        }
        return false;
    }

    currentUserIsCreator(): boolean {
        if (this.userService.userLoggedIn()) {
            return this.userService.currentUser.username === this.selectedProject.creator;
        }
        return false;
    }

    extractMarkdown(): void {
        try {
            this.form.value.comment = this.commentMarkdown.value();
        } catch (error) {
            // Be specific about the error we're looking for,
            // otherwise we may catch unintended errors
            if (error instanceof TypeError) {
                if (this.form) {
                    this.form.value.comment = "";
                }
            } else {
                throw error;
            }
        }
    }
}
