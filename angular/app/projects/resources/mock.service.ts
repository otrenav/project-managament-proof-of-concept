
// This is an asynchronous mock that makes use of Angular 2's
// in-memory web API. It takes the data down here and uses it as
// if it were retrieved form an actual web API. It's convenient
// for development.

import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {

    createDb() {
        let resources = [
            {
                id: 1,
                task: 1,
                details: 'Test Task Software 1',
                justification: 'Test Task Justification 1'
            },
            {
                id: 2,
                task: 2,
                details: 'Test Task Software 2',
                justification: 'Test Task Justification 2'
            },
            {
                id: 3,
                task: 3,
                details: 'Test Task Software 3',
                justification: 'Test Task Justification 3'
            },
            {
                id: 4,
                task: 4,
                details: 'Test Task Software 4',
                justification: 'Test Task Justification 4'
            },
            {
                id: 5,
                task: 5,
                details: 'Test Task Software 5',
                justification: 'Test Task Justification 5'
            },
            {
                id: 6,
                task: 6,
                details: 'Test Task Software 6',
                justification: 'Test Task Justification 6'
            }
        ];
        return {resources};
    }
}
