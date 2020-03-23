import Helpers from '../lib/Helpers';
import { Cases } from '../entity/Cases';

export const resolvers = {
    Query: {
        trend: async (root, args, ctx) => {
            const {connection} = await Helpers.prepareLambda();
            const cases = new Cases();
            const casesRepository = connection.getRepository(Cases);

            return casesRepository.find({geo_id: args.geo_id});
        }
    }
};
