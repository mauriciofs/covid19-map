import { expect } from 'chai';
import { handler } from '../src/cron/handler';
// import sinon from 'sinon';

describe('Service pull data test', () => {
    it('Should get data and update db', async () => {
        const response = await handler({date: '2020-03-20'});

        expect(response).to.be.true;
    });
});
