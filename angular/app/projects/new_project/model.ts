
//
// NOTE: this models are different of the ones in the
//       other parts of the application since they don't
//       include id's (except for Project in case we
//       need to overwrite a model instance in Django)
//       and they don't include anything that is not
//       necessary for the project form.
//

export class Project {
    //
    // NOTE: Since we want to avoid the hassle
    //       of instantiating all the empty
    //       parameters inside the service, we
    //       make them optional by appending
    //       the `?` symbol at the end
    //
    constructor(
        public id?: number,
        public base?: Base,
        public tasks?: Task[],
        public deliverables?: Deliverable[],
        public resources?: Resource[],
        public staffs?: Staff[]
    ) {}
}

export class Base {

    constructor(
        public name: string,
        public objective: string,
        public background: string
    ) {}
}

export class Task {

    constructor(
        public name: string,
        public start: string,
        public end: string
    ) {}
}

export class Resource {

    constructor(
        public task: string,
        public details: string,
        public justification: string
    ) {}
}

export class Deliverable {

    constructor(public description: string) {}
}

export class Staff {

    constructor(
        public user: string,
        public task: string,
        public role: string,
        public hours: number
    ) {}
}

