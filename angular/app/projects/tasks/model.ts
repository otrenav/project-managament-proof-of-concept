
export class Task {

    constructor(
        public id: number,
        public project: string,
        public users: string,
        public name: string,
        public start: string,
        public end: string
    ) {}
}
