const userType = `#graphql
    type User{
        id: ID!
        username: String!
        email: String!
        password: String!
        token: String!
        isAdmin: Boolean!
    }

    input RegisterInput {
        email: String
        username: String
        password: String
    }

    type Mutation {
        registerUser(registerInput: RegisterInput): User!
    }

    type Query {
        user: User
    }
`;

export default userType;
