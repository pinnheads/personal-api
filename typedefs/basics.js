const basicsType = `#graphql
    type Basics {
        id: ID
        firstName: String
        lastName: String
        currentRole: String
        phone: String
        summary: String
        location: String
        socials: [Url]
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
        socials: [UrlInput]
    }

    input BasicsUpdateInput {
        firstName: String
        lastName: String
        currentRole: String
        phone: String
        summary: String
        location: String
        socials: [UrlUpdateInput]
    }
    
    type Mutation {
        addBasics(basicsInput: BasicsInput): Basics
        updateBasics(basicsUpdateInput: BasicsUpdateInput): Basics!
        deleteBasics: Boolean!
    }
    `;

export default basicsType;
