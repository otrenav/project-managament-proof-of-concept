
// This is an asynchronous mock that makes use of Angular 2's
// in-memory web API. It takes the data down here and uses it as
// if it were retrieved form an actual web API. It's convenient
// for development.

import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {

    createDb() {
        let comments = [
            {
                id: 1,
                project: 1,
                user: 1,
                status: 1,
                comment: 'Test Comment 1',
                date: '2016-10-20'
            },
            {
                id: 2,
                project: 1,
                user: 2,
                status: 1,
                comment: 'Test Comment 2',
                date: '2016-10-21'
            },
            {
                id: 3,
                project: 1,
                user: 3,
                status: 1,
                comment: 'Test Comment 3',
                date: '2016-10-22'
            },
            {
                id: 4,
                project: 2,
                user: 1,
                status: 1,
                comment: 'Test Comment 4',
                date: '2016-10-23'
            },
            {
                id: 5,
                project: 2,
                user: 2,
                status: 1,
                comment: 'Test Comment 5',
                date: '2016-10-24'
            },
            {
                id: 6,
                project: 2,
                user: 3,
                status: 1,
                comment: 'Test Comment 6',
                date: '2016-10-25'
            },
            {
                id: 7,
                project: 3,
                user: 1,
                status: 1,
                comment: 'Test Comment 7',
                date: '2016-10-26'
            },
            {
                id: 8,
                project: 3,
                user: 2,
                status: 1,
                comment: 'Test Comment 8',
                date: '2016-10-27'
            },
            {
                id: 9,
                project: 3,
                user: 3,
                status: 1,
                comment: 'Test Comment 9',
                date: '2016-10-28'
            }
        ];
        return {comments};
    }
}
