export const schema = `
    type Case {
        date: String
        cases: Int
        deaths: Int
        country: String
        geo_id: String
    }

    type TotalCase {
        cases: Int
        deaths: Int
        country: String
        geo_id: String
    }

    type Query {
        cases: [TotalCase]!
        trend(geo_id: String): [Case]
    }
`;