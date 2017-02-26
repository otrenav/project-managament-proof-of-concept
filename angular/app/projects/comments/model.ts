
export class Comment {

    constructor(
        public id: number,
        public project: string,
        public user: string,
        public status: number,
        public comment: string,
        public date: string
    ) {}
}
