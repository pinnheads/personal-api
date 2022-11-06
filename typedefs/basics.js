const basicsType = `#graphql
    type Basics {
        id: ID!
        firstName: String!
        lastName: String!
        currentRole: String
        phone: String!
        summary: String!
        location: String!
        socials: [Url]
    }

    type Query {
        basics(id: ID!): Basics!
    }

    type Mutation {
        addBasics(  
            firstName: String,
            lastName: String,
            currentRole: String,
            phone: String,
            summary: String,
            location: String
        ): Basics
    }
`;

export default basicsType;
