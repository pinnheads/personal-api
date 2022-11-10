const basicsType = `#graphql
    type Basics {
        id: ID
        firstName: String
        lastName: String
        currentRole: String
        phone: String
        summary: String
        location: String
    }

    type Query {
        basics: Basics
    }

    input BasicsInput {
        firstName: String
        lastName: String
        currentRole: String
        phone: String
        summary: String
        location: String
    }

    type Mutation {
        addBasics(basicsInput: BasicsInput): Basics
        updateBasics(basicsInput: BasicsInput): Basics!
        deleteBasics: Boolean!
    }
`;

export default basicsType;
