const urlType = `#graphql
    type Url {
        id: ID!
        label: String
        link: String!
    }

    type Query {
        Url(id: ID!): Url!
    }

    type Mutation {
        addUrl(label: String, link: String): Url!
    }
`;

export default urlType;
