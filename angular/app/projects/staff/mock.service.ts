
// This is an asynchronous mock that makes use of Angular 2's
// in-memory web API. It takes the data down here and uses it as
// if it were retrieved form an actual web API. It's convenient
// for development.

import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {

    createDb() {
        let staff = [
            {
                id: 1,
                user: 1,
                task: 1,
                role: 'Test Role 1',
                hours: 1
            },
            {
                id: 1,
                user: 2,
                task: 2,
                role: 'Test Role 2',
                hours: 2
            },
            {
                id: 1,
                user: 3,
                task: 3,
                role: 'Test Role 3',
                hours: 3
            },
            {
                id: 1,
                user: 1,
                task: 4,
                role: 'Test Role 4',
                hours: 4
            },
            {
                id: 1,
                user: 2,
                task: 5,
                role: 'Test Role 5',
                hours: 5
            },
            {
                id: 1,
                user: 3,
                task: 6,
                role: 'Test Role 6',
                hours: 6
            },
            {
                id: 1,
                user: 1,
                task: 7,
                role: 'Test Role 7',
                hours: 7
            },
            {
                id: 1,
                user: 2,
                task: 8,
                role: 'Test Role 8',
                hours: 8
            },
            {
                id: 1,
                user: 3,
                task: 9,
                role: 'Test Role 9',
                hours: 9
            }
        ];
        return {staff};
    }
}
