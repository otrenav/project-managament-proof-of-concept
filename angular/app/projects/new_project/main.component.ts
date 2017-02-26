
import { Router,
         Params,
         ActivatedRoute }           from '@angular/router';
import { Component,
         OnInit,
         DoCheck,
         AfterViewInit }            from '@angular/core';
import { FormBuilder,
         FormGroup,
         FormControl,
         FormArray }                from '@angular/forms';

import { NewProjectService }        from './main.service';
import { UserService }              from '../../users/index';

declare var SimpleMDE: any;


@Component({
    moduleId: module.id,
    selector: 'new-project',
    templateUrl: 'main.component.html'
})
export class NewProjectComponent implements OnInit, AfterViewInit, DoCheck {

    private form: FormGroup;
    private tasks: FormArray;
    private staffs: FormArray;
    private resources: FormArray;
    private deliverables: FormArray;
    private activeTab: string = "base";
    private projectID: number = null;
    private errorMessage: string = null;
    private disabledMessage: boolean;
    private disabled: boolean;
    private userArray: any[];

    //
    // NOTE: This is not the best, but when dealing
    // with unknown objects it's the best we can do
    // given that the Markdown library we're using
    // does not provide classes for it's objects,
    // so we need to use a generic type (`any`).
    //
    objectiveMarkdown: any;
    backgroundMarkdown: any;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private userService: UserService,
        private projectService: NewProjectService
    ) {}

    ngOnInit(): void {
        this.setupUsers();
        this.buildFullForm();
        this.applyPermissions();
        this.route.params.forEach((params: Params) => {
            if ("id" in params) {
                this.projectID = <number> params['id'];
                this.projectService.getFullProject(this.projectID)
                    .then(json => {
                        this.buildFullForm(json);
                        this.buildFullProject(json);
                    });
            }
        });
    }

    buildFullForm(json?: any): void {
        this.form = this.fb.group({
            base: this.buildBase(),
            tasks: this.buildTasks(json),
            resources: this.buildResources(json),
            deliverables: this.buildDeliverables(json),
            staffs: this.buildStaffs(json)
        });
    }

    buildFullProject(json: any): void {
        // this.form.patchValue(json);
        this.form.setValue(json);
        this.objectiveMarkdown.value(json.base.objective);
        this.backgroundMarkdown.value(json.base.background);
    }

    private setupUsers(): void {
        this.userService
            .getUsers()
            .then(users => this.userArray = users);
    }

    //
    // Base
    //
    buildBase(): FormGroup {
        return this.fb.group({
            name: '',
            objective: '',
            background: ''
        });
    }

    //
    // Tasks
    //
    buildTasks(json: any): FormArray {
        let tasks_array: any = [];
        if (json) {
            for (let i = 0; i < json.tasks.length; i++) {
                tasks_array.push(this.buildTask());
            }
        } else {
            tasks_array.push(this.buildTask());
        }
        this.tasks = this.fb.array(tasks_array);
        return this.tasks;
    }

    buildTask(): FormGroup {
        return this.fb.group({
            name: '',
            start: this.today(),
            end: this.today()
        });
    }

    addTask(): void {
        this.tasks.push(this.buildTask());
    }

    deleteTask(i: number): void {
        this.removeTaskFromDependentDropdowns(i);
        const control = <FormArray> this.form.controls['tasks'];
        control.removeAt(i);
    }

    removeTaskFromDependentDropdowns(i: number): void {
        this.removeTaskFromSection(i, 'resources');
        this.removeTaskFromSection(i, 'staffs');
    }

    removeTaskFromSection(i: number, section: string) {
        for (let j = 0; j < this.form.value[section].length; j++) {
            if (this.form.value[section][j].task === i) {
                this.form.controls[section]['controls'][j].patchValue({task: ''});
            } else if (this.form.value[section][j].task > i) {
                // We need to shift down, so we subtract one from the current task ID
                let t: number = this.form.controls[section]['controls'][j].controls.task._value - 1;
                this.form.controls[section]['controls'][j].patchValue({task: t});
            }
        }
    }

    getTasks() {
        let tasksArray: string[] = [];
        this.tasks.value.forEach((task: any) => tasksArray.push(task.name));
        return(tasksArray);
    }

    //
    // Resources
    //
    buildResources(json: any): FormArray {
        let resources_array: any = [];
        if (json) {
            for (let i = 0; i < json.resources.length; i++) {
                resources_array.push(this.buildResource());
            }
        } else {
            resources_array.push(this.buildResource());
        }
        this.resources = this.fb.array(resources_array);
        return this.resources;
    }

    buildResource(): FormGroup {
        return this.fb.group({
            task: '',
            details: '',
            justification: ''
        });
    }

    addResource(): void {
        this.resources.push(this.buildResource());
    }

    deleteResource(i: number): void {
        const control = <FormArray> this.form.controls['resources'];
        control.removeAt(i);
    }

    //
    // Deliverables
    //
    buildDeliverables(json: any): FormArray {
        let deliverables_array: any = []
        if (json) {
            for (let i = 0; i < json.deliverables.length; i++) {
                deliverables_array.push(this.buildDeliverable());
            }
        } else {
            deliverables_array.push(this.buildDeliverable());
        }
        this.deliverables = this.fb.array(deliverables_array);
        return this.deliverables;
    }

    buildDeliverable(): FormGroup {
        return this.fb.group({
            description: ''
        });
    }

    addDeliverable(): void {
        this.deliverables.push(this.buildDeliverable());
    }

    deleteDeliverable(i: number): void {
        const control = <FormArray> this.form.controls['deliverables'];
        control.removeAt(i);
    }

    //
    // Staffs
    //
    buildStaffs(json: any): FormArray {
        let staffs_array: any = []
        if (json) {
            for (let i = 0; i < json.staffs.length; i++) {
                staffs_array.push(this.buildStaff());
            }
        } else {
            staffs_array.push(this.buildStaff());
        }
        this.staffs = this.fb.array(staffs_array);
        return this.staffs;
    }

    buildStaff(): FormGroup {
        return this.fb.group({
            user: '',
            task: '',
            role: '',
            hours: ''
        });
    }

    addStaff(): void {
        this.staffs.push(this.buildStaff());
    }

    deleteStaff(i: number): void {
        const control = <FormArray> this.form.controls['staffs'];
        control.removeAt(i);
    }

    //
    // Tabs
    //
    activateTab(tab: string): void {
        this.disabledMessage = false;
        this.errorMessage = null;
        this.activeTab = tab;
    }

    isTabActive(tab: string): boolean {
        return(this.activeTab == tab);
    }

    //
    // Hooks
    //
    ngAfterViewInit() {
        this.loadMarkdown();
    }

    ngDoCheck() {
        this.extractMarkdown();
    }

    //
    // Markdown
    //
    loadMarkdown(): void {
        this.objectiveMarkdown = new SimpleMDE({
            element: document.getElementById("objectiveMarkdownID")
        });
        this.backgroundMarkdown = new SimpleMDE({
            element: document.getElementById("backgroundMarkdownID")
        });
    }

    extractMarkdown(): void {
        try {
            this.form.value.base.objective = this.objectiveMarkdown.value();
            this.form.value.base.background = this.backgroundMarkdown.value();
        } catch (error) {
            // Be specific about the error we're looking for,
            // otherwise we may catch unintended errors
            if (error instanceof TypeError) {
                if (this.form) {
                    this.form.value.base.objective = "";
                    this.form.value.base.background = "";
                }
            } else {
                throw error;
            }
        }
    }

    //
    // Dates
    //
    today(): string {
        let d = new Date();
        let month = this.addMissingZero(d.getMonth() + 1);
        let day = this.addMissingZero(d.getDate());
        let year = d.getFullYear();
        return year + '-' + month + '-' + day;
    }

    addMissingZero(n: number): string {
        if (n < 10) {
            return '0' + <string> <any> n;
        } else {
            return <string> <any> n;
        }
    }

    //
    // Others
    //
    getUsers(): any[] {
        return(this.userArray);
    }

    saveForm(form: any): void {
        this.projectService.save(
            this.userService.currentUser,
            this.form.value,
            this.projectID
        ).then(response => {
            if (response === "OK") {
                this.router.navigate(['dashboard']);
            } else {
                this.errorMessage = response;
            }
        });
    }

    applyPermissions(): void {
        if (this.userService.currentUserIsCouncil() ||
            this.userService.currentUserIsApprover()) {
            this.disabled = true;
            this.disabledMessage = true;
        } else {
            this.disabled = false;
            this.disabledMessage = false;
        }
    }
}
