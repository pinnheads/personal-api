const urlType = `#graphql
    type Url {
        id: ID
        label: String
        link: String
        userId: ID
    }

    type Query {
        Url(id: ID!): Url!
    }

    input UrlInput {
        label: String
        link: String
    }

    input UrlUpdateInput {
        id: ID!
        label: String!
        link: String!
    }

    type Mutation {
        addUrl(urlInput: UrlInput): Url!
        updateUrl(urlUpdateInput: UrlUpdateInput): Url!
        deleteUrl(id: ID!): Boolean!
    }
`;

export default urlType;
