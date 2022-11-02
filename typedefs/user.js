const userType = `#graphql

    type User {
        username: String
        email: String
        password: String
        token: String
    }

    input RegisterInput {
        username: String,
        email: String,
        password: String,        
    }

    input LoginInput {
        email: String
        password: String
    }

    type Mutation {
        registerUser(registerInput: RegisterInput): User!
        loginUser(loginInput: LoginInput): String!
    }

    type Query {
        user(id: ID!): User!
    }
`;

export default userType;
