/* eslint-disable no-undef */
import setupServer from './index';
import User from '../models/user';

describe('Users', () => {
  let apolloTestServer;

  beforeAll(async () => {
    apolloTestServer = await setupServer();
    await User.deleteMany();
  });

  afterAll(async () => {
    await User.deleteMany();
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

  test('[User]: Make Admin - Happy Path', async () => {
    // Create a new user
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "newuser1@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    // Manually set the new user to Admin
    const user = await User.findById(response.body.singleResult.data.registerUser.id);
    user.isAdmin = true;
    await user.save();
    // Create a new user
    const nonAdminUser = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "newuser2@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    const nonAdminUserId = nonAdminUser.body.singleResult.data.registerUser.id;
    // Send the mutation query with new user id to set as admin
    const makeAdminRes = await apolloTestServer.server.executeOperation({
      query: `mutation Mutation { makeAdmin(id: "${nonAdminUserId}") }`,
    }, {
      // Add admin user to context
      contextValue: {
        user,
      },
    });
    expect(makeAdminRes.body.singleResult.data.makeAdmin).toBeTruthy();
    expect(makeAdminRes.body.singleResult.errors).toBeUndefined();
  });

  test('[User]: Make Admin - When a non admin tries to make someone admin', async () => {
    // Create a new user
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "newuser01@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    // Get the new user
    const user = await User.findById(response.body.singleResult.data.registerUser.id);
    // Create a new user
    const nonAdminUser = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "newuser02@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    const nonAdminUserId = nonAdminUser.body.singleResult.data.registerUser.id;
    // Send the mutation query with new user id to set as admin
    const makeAdminRes = await apolloTestServer.server.executeOperation({
      query: `mutation Mutation { makeAdmin(id: "${nonAdminUserId}") }`,
    }, {
      // Add admin user to context
      contextValue: {
        user,
      },
    });
    expect(makeAdminRes.body.singleResult.errors).toBeDefined();
  });

  test('[User]: Make Admin - User doesn\'t exists', async () => {
    // Create a new user
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "newuser011@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    // Get the new user
    const user = await User.findById(response.body.singleResult.data.registerUser.id);
    user.isAdmin = true;
    await user.save();
    const makeAdminRes = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { makeAdmin(id: "6369d4a27ee22a100416c7b3") }',
    }, {
      // Add admin user to context
      contextValue: {
        user,
      },
    });
    expect(makeAdminRes.body.singleResult.errors).toBeDefined();
  });

  test('[User]: Get User - Happy Path', async () => {
    // Create a new user
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "testuser@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    // Get the new user
    const user = await User.findById(response.body.singleResult.data.registerUser.id);
    const getUser = await apolloTestServer.server.executeOperation({
      query: 'query Query { user { email id isAdmin password token username } }',
    }, {
      // Add admin user to context
      contextValue: {
        user,
      },
    });
    expect(getUser.body.singleResult.errors).toBeUndefined();
  });

  test('[User]: Delete User - Happy Path', async () => {
    // Create a new user
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "deleteuser1@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    // Manually set the new user to Admin
    const user = await User.findById(response.body.singleResult.data.registerUser.id);
    user.isAdmin = true;
    await user.save();
    // Create a new user
    const nonAdminUser = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "deleteuser2@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    const nonAdminUserId = nonAdminUser.body.singleResult.data.registerUser.id;
    // Send the mutation query with new user id to set as admin
    const deleteUserRes = await apolloTestServer.server.executeOperation({
      query: `mutation Mutation { deleteUser(id: "${nonAdminUserId}") }`,
    }, {
      // Add admin user to context
      contextValue: {
        user,
      },
    });
    expect(deleteUserRes.body.singleResult.data.deleteUser).toBeTruthy();
    expect(deleteUserRes.body.singleResult.errors).toBeUndefined();
  });

  test('[User]: Delete User - When a non admin tries to delete an user', async () => {
    // Create a new user
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "deleteUser01@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    // Get the new user
    const user = await User.findById(response.body.singleResult.data.registerUser.id);
    // Create a new user
    const nonAdminUser = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "deleteUser02@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    const nonAdminUserId = nonAdminUser.body.singleResult.data.registerUser.id;
    // Send the mutation query with new user id to set as admin
    const deleteUserRes = await apolloTestServer.server.executeOperation({
      query: `mutation Mutation { deleteUser(id: "${nonAdminUserId}") }`,
    }, {
      // Add admin user to context
      contextValue: {
        user,
      },
    });
    expect(deleteUserRes.body.singleResult.errors).toBeDefined();
  });

  test('[User]: Delete User - User doesn\'t exists', async () => {
    // Create a new user
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "deleteuser011@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    // Get the new user
    const user = await User.findById(response.body.singleResult.data.registerUser.id);
    user.isAdmin = true;
    await user.save();
    const deleteUserRes = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { deleteUser(id: "6369d4a27ee22a100416c7b3") }',
    }, {
      // Add admin user to context
      contextValue: {
        user,
      },
    });
    expect(deleteUserRes.body.singleResult.errors).toBeDefined();
  });

  test('[User]: Update Password - Happy Path', async () => {
    // Create a new user
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "updateuser011@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    // Get the new user
    const user = await User.findById(response.body.singleResult.data.registerUser.id);
    const updatePasswordRes = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { updatePassword( updatePasswordInput: { email: "updateuser011@gmail.com" newPassword: "test123123123" oldPassword: "test123123" } ) }',
    }, {
      // Add admin user to context
      contextValue: {
        user,
      },
    });
    expect(updatePasswordRes.body.singleResult.errors).toBeUndefined();
  });

  test('[User]: Update Password - Invalid Email', async () => {
    // Create a new user
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "updateuser012@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    // Get the new user
    const user = await User.findById(response.body.singleResult.data.registerUser.id);
    const updatePasswordRes = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { updatePassword( updatePasswordInput: { email: "updateuser01@gmail.com" newPassword: "test123123123" oldPassword: "test123123" } ) }',
    }, {
      // Add admin user to context
      contextValue: {
        user,
      },
    });
    expect(updatePasswordRes.body.singleResult.errors).toBeDefined();
  });

  test('[User]: Update Password - Invalid old password', async () => {
    // Create a new user
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "updateuser013@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    // Get the new user
    const user = await User.findById(response.body.singleResult.data.registerUser.id);
    const updatePasswordRes = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { updatePassword( updatePasswordInput: { email: "updateuser013@gmail.com" newPassword: "test123123123" oldPassword: "test12312" } ) }',
    }, {
      // Add admin user to context
      contextValue: {
        user,
      },
    });
    expect(updatePasswordRes.body.singleResult.errors).toBeDefined();
  });

  test('[User]: Update Password - User not signed in', async () => {
    await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "updateuser014@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    const updatePasswordRes = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { updatePassword( updatePasswordInput: { email: "updateuser014@gmail.com" newPassword: "test123123123" oldPassword: "test12312" } ) }',
    });
    expect(updatePasswordRes.body.singleResult.errors).toBeDefined();
  });
});
