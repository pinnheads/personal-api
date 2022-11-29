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

    input UpdateDetailsInput {
        email: String
        username: String
    }

    type Mutation {
        registerUser(registerInput: RegisterInput): User!
        updateUserDetails(updateDetails: UpdateDetailsInput): User!
        deleteUser(email: String): Boolean!
    }

    type Query {
        user: User
    }
`;

export default userType;
