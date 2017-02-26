
export class Project {

    constructor(
        public id: number,
        public name: string,
        public state: number,
        public objective: string,
        public background: string
    ) {}
}

export class DetailProject {

    constructor(
        public id: number,
        public name: string,
        public state: number,
        public state_text: string,
        public objective: string,
        public background: string,
        public creator: string,
        public recommenders: string[],
        public comments: any[]
    ) {}
}


