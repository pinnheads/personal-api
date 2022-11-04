const userType = `#graphql
    directive @auth(requires: Role = ADMIN) on OBJECT | FIELD_DEFINITION

    enum Role {
        ADMIN
        USER
    }

    type User @auth(requires: USER) {
        username: String!
        email: String!
        password: String!
        token: String
        role: String @auth(requires: ADMIN)
        basics: Basics
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
