
export class User {

    constructor(
        public id: number,
        public username: string,
        public token: string,
        public groups: string
    ) {}
}
