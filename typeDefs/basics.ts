const basicsType = `#graphQl
  type Basics {
    id: ID
    userId: String
    firstName: String
    middleName: String
    lastName: String
    summary: String
    location: String
    label: String
    url: String
    yearsOfExperience: Int
    blog: String
    profile: [UrlOutput]
  }

  input BasicsInput {
    firstName: String
    middleName: String
    lastName: String
    summary: String
    location: String
    label: String
    url: String
    yearsOfExperience: Int
    blog: String
    profile: [UrlInput]
  }

  type Query {
    basics(id: ID!): Basics!
  }

  type Mutation {
    addBasics(basicsInput: BasicsInput): Basics!
    updateBasics(id: ID, basicsInput: BasicsInput): Basics!
    deleteBasics(id: ID): Boolean!
  }
`;

export default basicsType;
