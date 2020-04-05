import { expect } from 'chai';
import { handler } from '../src/graphql';
import { APIGatewayEvent } from 'aws-lambda';

describe('Graphql api test', () => {
    it('Should get cases', (done) => {
        const event: APIGatewayEvent = require('./event.json');
        const callback = (error, result) => {
            const body = JSON.parse(result.body);

            expect(result.statusCode).to.be.equal(200);
            expect(body.data.cases).to.be.not.empty;
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
                        country
                    }
                }`,
            })},
            {},
            callback
        );
    });

    it('Should get trend', (done) => {
        const event: APIGatewayEvent = require('./event.json');
        const callback = (error, result) => {
            const body = JSON.parse(result.body);

            expect(result.statusCode).to.be.equal(200);
            expect(body.data.trend).to.be.not.empty;
            expect(body.data.trend[0].country).to.be.equal('Ireland');
            expect(body.data.trend[0].date).to.be.equal('2019-12-31');
            expect(body.data.trend[0].geo_id).to.be.equal('IE');
            done();
        };

        handler({
            ...event,
            body: JSON.stringify({
                query: `{
                    trend(geo_id: "IE") {
                        cases
                        date
                        deaths
                        country
                        geo_id
                    }
                }`,
            })},
            {},
            callback
        );
    });
});
