
// This is an asynchronous mock that makes use of Angular 2's
// in-memory web API. It takes the data down here and uses it as
// if it were retrieved form an actual web API. It's convenient
// for development.

import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {

    createDb() {
        let tasks = [
            {
                id: 1,
                project: 1,
                user: 1,
                name: 'Test Task 1',
                start: '2016-10-20',
                end: '2016-10-21'
            },
            {
                id: 2,
                project: 1,
                user: 1,
                name: 'Test Task 2',
                start: '2016-10-21',
                end: '2016-10-22'
            },
            {
                id: 3,
                project: 1,
                user: 1,
                name: 'Test Task 3',
                start: '2016-10-22',
                end: '2016-10-23'
            },
            {
                id: 4,
                project: 2,
                user: 1,
                name: 'Test Task 4',
                start: '2016-10-23',
                end: '2016-10-24'
            },
            {
                id: 5,
                project: 2,
                user: 1,
                name: 'Test Task 5',
                start: '2016-10-24',
                end: '2016-10-25'
            },
            {
                id: 6,
                project: 2,
                user: 1,
                name: 'Test Task 6',
                start: '2016-10-25',
                end: '2016-10-26'
            },
            {
                id: 7,
                project: 3,
                user: 1,
                name: 'Test Task 7',
                start: '2016-10-26',
                end: '2016-10-27'
            },
            {
                id: 8,
                project: 3,
                user: 1,
                name: 'Test Task 8',
                start: '2016-10-27',
                end: '2016-10-28'
            },
            {
                id: 9,
                project: 3,
                user: 1,
                name: 'Test Task 9',
                start: '2016-10-28',
                end: '2016-10-29'
            }
        ];
        return {tasks};
    }
}
