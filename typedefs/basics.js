const basicsType = `#graphql
    type Basics {
        id: ID!
        firstName: String!
        lastName: String!
        currentRole: String
        phone: String!
        summary: String!
        location: String!
        socials: Url
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
