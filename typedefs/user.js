const userType = `#graphql

    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        token: String
        isAdmin: Boolean!
    }

    input RegisterInput {
        email: String
        username: String
        password: String        
    }

    input LoginInput {
        email: String
        password: String
    }

    input UpdatePasswordInput {
        email: String
        oldPassword: String
        newPassword: String
    }

    type Mutation {
        loginUser(loginInput: LoginInput): User
        registerUser(registerInput: RegisterInput): User!
        deleteUser(id: ID!): Boolean!
        updatePassword(updatePasswordInput: UpdatePasswordInput): Boolean!
        makeAdmin(id: ID!): Boolean!
    }

    type Query {
        user: User
    }
`;

export default userType;
