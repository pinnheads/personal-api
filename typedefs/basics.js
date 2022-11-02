const basicsType = `#graphql
    type Basics {
        id: ID!
        name: String!
        currentRole: String
        email: String!
        phone: String!
        website: Url
        summary: String!
        location: String!
    }

    type Query {
        basics(id: ID!): Basics!
    }

    type Mutation {
        addBasics(  
            name: String,
            currentRole: String,
            email: String,
            phone: String,
            label: String,
            link: String,
            summary: String,
            location: String
        ): Basics
    }
`;

export default basicsType;
