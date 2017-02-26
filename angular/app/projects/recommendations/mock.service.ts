
// This is an asynchronous mock that makes use of Angular 2's
// in-memory web API. It takes the data down here and uses it as
// if it were retrieved form an actual web API. It's convenient
// for development.

import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {

    createDb() {
        let recommendations = [
            {
                id: 1,
                project: 1,
                user: 1
            },
            {
                id: 2,
                project: 2,
                user: 2
            },
            {
                id: 3,
                project: 3,
                user: 3
            }
        ];
        return {recommendations};
    }
}
