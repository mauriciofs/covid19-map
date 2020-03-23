import { expect } from 'chai';
import { handler } from '../src/graphql';
import { APIGatewayEvent } from 'aws-lambda';

describe('Graphql api test', () => {
    it('Should get cases', (done) => {
        const event: APIGatewayEvent = require('./event.json');
        const callback = (error, result) => {
            console.log(result);

            expect(result).to.be.not.empty;
            done();
        };

        handler({
            ...event,
            body: JSON.stringify({
                query: `{
                    cases {
                        cases
                        deaths
                        geo_id
                    }
                }`,
            })},
            {},
            callback
        );
    });
});
