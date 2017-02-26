
// This is an asynchronous mock that makes use of Angular 2's
// in-memory web API. It takes the data down here and uses it as
// if it were retrieved form an actual web API. It's convenient
// for development.

import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {

    createDb() {
        let deliverables = [
            {
                id: 1,
                project: 1,
                description: 'Test Deliverable Description 1'
            },
            {
                id: 2,
                project: 1,
                description: 'Test Deliverable Description 2'
            },
            {
                id: 3,
                project: 1,
                description: 'Test Deliverable Description 3'
            },
            {
                id: 4,
                project: 2,
                description: 'Test Deliverable Description 4'
            },
            {
                id: 5,
                project: 2,
                description: 'Test Deliverable Description 5'
            },
            {
                id: 6,
                project: 2,
                description: 'Test Deliverable Description 6'
            },
            {
                id: 7,
                project: 3,
                description: 'Test Deliverable Description 7'
            },
            {
                id: 8,
                project: 3,
                description: 'Test Deliverable Description 8'
            },
            {
                id: 9,
                project: 3,
                description: 'Test Deliverable Description 9'
            }
        ];
        return {deliverables};
    }
}
