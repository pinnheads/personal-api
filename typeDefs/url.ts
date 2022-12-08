const urlType = `#graphql
  type Url {
    id: ID
    basicsId: ID
    label: String
    url: String
  }

  type UrlOutput {
    label: String
    url: String
  }

  input UrlInput {
    label: String
    url: String
  }
`;

export default urlType;
