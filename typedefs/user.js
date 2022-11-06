const userType = `#graphql

    type User {
        username: String!
        email: String!
        password: String!
        token: String
        role: [String]!
        basics: Basics
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
        loginUser(loginInput: LoginInput): String!
        registerUser(registerInput: RegisterInput): User!
    }

    type Query {
        user: User!
    }
`;

export default userType;
