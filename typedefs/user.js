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

    type Mutation {
        loginUser(loginInput: LoginInput): User
        registerUser(registerInput: RegisterInput): User!
        makeAdmin(id: ID!): Boolean!
    }

    type Query {
        user: User
    }
`;

export default userType;
