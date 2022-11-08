/* eslint-disable no-undef */
import * as graphql from 'graphql';
import setupServer from './index';

describe('Users', () => {
  let apolloTestServer;
  beforeAll(async () => {
    apolloTestServer = await setupServer();
    apolloTestServer.db.dropCollection('users');
  });
  afterAll(async () => {
    await apolloTestServer.db.close();
  });

  test('[User]: User Signup - Happy Path', async () => {
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "utsavdeep0123@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    expect(response.body.singleResult.errors).toBeUndefined();
    const data = response.body.singleResult.data.registerUser;
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('username');
    expect(data).toHaveProperty('email');
    expect(data).toHaveProperty('password');
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('isAdmin');
    expect(data.id).toMatch(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i);
  });
  test('[User]: User Signup - User already exists', async () => {
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "utsavdeep0123@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    expect(response.body.singleResult.errors).toBeDefined();
  });
  test('[User]: User Signup - Invalid Email', async () => {
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "utsavdeep0123@gmail"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    expect(response.body.singleResult.errors).toBeDefined();
  });
  test('[User]: User Signup - No Username', async () => {
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "utsavdeep0123@gmail"  username: "" password: "test123123" }) { id username email password token isAdmin } }',
    });
    expect(response.body.singleResult.errors).toBeDefined();
  });
  test('[User]: User Signup - No Password', async () => {
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "utsavdeep0123@gmail"  username: "pinnheads" password: "" }) { id username email password token isAdmin } }',
    });
    expect(response.body.singleResult.errors).toBeDefined();
  });
  test('[User]: User Login - Happy Path', async () => {
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { loginUser( loginInput: { email: "utsavdeep0123@gmail.com", password: "test123123" } ) { id username email password token isAdmin }}',
    });
    expect(response.body.singleResult.errors).toBeUndefined();
    const data = response.body.singleResult.data.loginUser;
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('username');
    expect(data).toHaveProperty('email');
    expect(data).toHaveProperty('password');
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('isAdmin');
    expect(data.id).toMatch(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i);
  });
  test('[User]: User Login - Empty email and Valid password', async () => {
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { loginUser( loginInput: { email: "", password: "test123123" } ) { id username email password token isAdmin }}',
    });
    expect(response.body.singleResult.errors).toBeDefined();
  });
  test('[User]: User Login - Valid email and Empty password', async () => {
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { loginUser( loginInput: { email: "utsavdeep0123@gmail.com", password: "" } ) { id username email password token isAdmin }}',
    });
    expect(response.body.singleResult.errors).toBeDefined();
  });
  test('[User]: User Login - Invalid email and Valid password', async () => {
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { loginUser( loginInput: { email: "utsavdeep012@gmail.com", password: "test123123" } ) { id username email password token isAdmin }}',
    });
    expect(response.body.singleResult.errors).toBeDefined();
  });
  test('[User]: User Login - Valid email and Invalid password', async () => {
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { loginUser( loginInput: { email: "utsavdeep0123@gmail.com", password: "test12312" } ) { id username email password token isAdmin }}',
    });
    expect(response.body.singleResult.errors).toBeDefined();
  });
});
