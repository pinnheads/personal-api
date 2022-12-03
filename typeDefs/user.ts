const userType = `#graphql
    type User{
        id: ID!
        username: String!
        email: String!
        password: String!
        token: String!
        isAdmin: Boolean!
        basics: Basics
    }

    type ReturnUser {
        id: ID!
        username: String!
        email: String!
        token: String!
        basics: Basics
    }

    type AllUsers {
        id: ID!
        username: String!
        email: String!
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
        user: ReturnUser!
        allUsers: [AllUsers]!
    }
`;

export default userType;
