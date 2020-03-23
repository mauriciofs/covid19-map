import Cases from '../entity/Cases';
import { Connection } from 'typeorm';

export const resolvers = {
    Query: {
        trend: (_, args) => Cases.find({where: {geo_id: args.geo_id}, order: {date: 'ASC'}}),
        cases: (root, args, ctx) => (ctx.connection as Connection).getRepository(Cases)
                                        .createQueryBuilder('cases')
                                        .select('SUM(cases) as cases, SUM(deaths) as deaths, country, geo_id')
                                        .orderBy('cases', 'DESC')
                                        .groupBy('geo_id, country')
                                        .getMany(),
    }
};
