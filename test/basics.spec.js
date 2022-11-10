/* eslint-disable no-undef */
import setupServer from './index';
import User from '../models/user';
import Basics from '../models/basics';

describe('Basics', () => {
  let apolloTestServer;
  beforeAll(async () => {
    apolloTestServer = await setupServer();
    await Basics.deleteMany();
    await User.deleteMany();
  });

  afterAll(async () => {
    await User.deleteMany();
    await Basics.deleteMany();
    await apolloTestServer.db.close();
    await apolloTestServer.server.stop();
  });

  test('[Basics]: Add Basics - Happy Path', async () => {
    const userResponse = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "basicsuser123@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    expect(userResponse.body.singleResult.errors).toBeUndefined();
    const globalUser = await User.findById(userResponse.body.singleResult.data.registerUser.id);
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { addBasics( basicsInput: { currentRole: "test" firstName: "test" lastName: "test" location: null phone: "8867834648" summary: null }) { currentRole firstName id lastName location phone summary} }',
    }, {
      // Add user to context
      contextValue: {
        user: globalUser,
      },
    });
    expect(response.body.singleResult.errors).toBeUndefined();
    const data = response.body.singleResult.data.addBasics;
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('firstName');
    expect(data).toHaveProperty('lastName');
    expect(data).toHaveProperty('currentRole');
    expect(data).toHaveProperty('location');
    expect(data).toHaveProperty('phone');
    expect(data).toHaveProperty('summary');
  });

  test('[Basics]: Add Basics - Invalid Phone', async () => {
    const userResponse = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "basicsuser222@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    expect(userResponse.body.singleResult.errors).toBeUndefined();
    const globalUser = await User.findById(userResponse.body.singleResult.data.registerUser.id);
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { addBasics( basicsInput: { currentRole: "test" firstName: "test" lastName: "test" location: null phone: null summary: null }) { currentRole firstName id lastName location phone summary} }',
    }, {
      // Add user to context
      contextValue: {
        user: globalUser,
      },
    });
    expect(response.body.singleResult.errors).toBeDefined();
  });

  test('[Basics]: Add Basics - Basics data is already present', async () => {
    // Create a new user
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "basicsuser2@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin basics { currentRole firstName id lastName location phone summary } } }',
    });
    expect(response.body.singleResult.errors).toBeUndefined();
    const data = response.body.singleResult.data.registerUser;
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('username');
    expect(data).toHaveProperty('email');
    expect(data).toHaveProperty('password');
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('isAdmin');
    expect(data).toHaveProperty('basics');
    expect(data.basics).toBeNull();
    // Get the new user
    const user = await User.findById(response.body.singleResult.data.registerUser.id);
    await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { addBasics( basicsInput: { currentRole: "test" firstName: "test" lastName: "test" location: null phone: "8867834648" summary: null }) { currentRole firstName id lastName location phone summary} }',
    }, {
      // Add user to context
      contextValue: {
        user,
      },
    });
    const getUser = await apolloTestServer.server.executeOperation({
      query: 'query Query { user { email id isAdmin password token username  basics { currentRole firstName id lastName location phone summary } } }',
    }, {
      // Add admin user to context
      contextValue: {
        user,
      },
    });
    expect(getUser.body.singleResult.errors).toBeUndefined();
    const userData = getUser.body.singleResult.data.user;
    expect(userData).toHaveProperty('id');
    expect(userData).toHaveProperty('username');
    expect(userData).toHaveProperty('email');
    expect(userData).toHaveProperty('password');
    expect(userData).toHaveProperty('token');
    expect(userData).toHaveProperty('isAdmin');
    expect(userData).toHaveProperty('basics');
    expect(userData.basics).toHaveProperty('currentRole');
    expect(userData.basics).toHaveProperty('firstName');
    expect(userData.basics).toHaveProperty('lastName');
    expect(userData.basics).toHaveProperty('id');
    expect(userData.basics).toHaveProperty('location');
    expect(userData.basics).toHaveProperty('phone');
    expect(userData.basics).toHaveProperty('summary');

    const result = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { addBasics( basicsInput: { currentRole: "test" firstName: "test" lastName: "test" location: null phone: "8867834648" summary: null }) { currentRole firstName id lastName location phone summary} }',
    }, {
      // Add user to context
      contextValue: {
        user,
      },
    });
    expect(result.body.singleResult.errors).toBeDefined();
  });

  test('[Basics]: Update Basics - Happy Path', async () => {
    const userResponse = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "basicsuserupdate@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    expect(userResponse.body.singleResult.errors).toBeUndefined();
    const globalUser = await User.findById(userResponse.body.singleResult.data.registerUser.id);
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { addBasics( basicsInput: { currentRole: "test" firstName: "test" lastName: "test" location: null phone: "8867834648" summary: null }) { currentRole firstName id lastName location phone summary} }',
    }, {
      // Add user to context
      contextValue: {
        user: globalUser,
      },
    });
    expect(response.body.singleResult.errors).toBeUndefined();
    const data = response.body.singleResult.data.addBasics;
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('firstName');
    expect(data).toHaveProperty('lastName');
    expect(data).toHaveProperty('currentRole');
    expect(data).toHaveProperty('location');
    expect(data).toHaveProperty('phone');
    expect(data).toHaveProperty('summary');
    expect(data.summary).toBeNull();

    const updateResponse = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { updateBasics( basicsInput: { currentRole: "test" firstName: "test" lastName: "test" location: null phone: "8867834648" summary: "test" }) { currentRole firstName id lastName location phone summary} }',
    }, {
      // Add user to context
      contextValue: {
        user: globalUser,
      },
    });
    expect(updateResponse.body.singleResult.errors).toBeUndefined();
    const updatedData = updateResponse.body.singleResult.data.updateBasics;
    expect(updatedData).toHaveProperty('id');
    expect(updatedData).toHaveProperty('firstName');
    expect(updatedData).toHaveProperty('lastName');
    expect(updatedData).toHaveProperty('currentRole');
    expect(updatedData).toHaveProperty('location');
    expect(updatedData).toHaveProperty('phone');
    expect(updatedData).toHaveProperty('summary');
    expect(updatedData.summary).toBe('test');
  });

  test('[Basics]: Update Basics - No Basics data present', async () => {
    const userResponse = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "basicsuserupdate1@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    expect(userResponse.body.singleResult.errors).toBeUndefined();
    const globalUser = await User.findById(userResponse.body.singleResult.data.registerUser.id);
    const updateResponse = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { updateBasics( basicsInput: { currentRole: "test" firstName: "test" lastName: "test" location: null phone: "8867834648" summary: "test" }) { currentRole firstName id lastName location phone summary} }',
    }, {
      // Add user to context
      contextValue: {
        user: globalUser,
      },
    });
    expect(updateResponse.body.singleResult.errors).toBeDefined();
  });

  test('[Basics]: Get Basics - Happy Path', async () => {
    const userResponse = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "getbasics1@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    expect(userResponse.body.singleResult.errors).toBeUndefined();
    const globalUser = await User.findById(userResponse.body.singleResult.data.registerUser.id);
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { addBasics( basicsInput: { currentRole: "test" firstName: "test" lastName: "test" location: null phone: "8867834648" summary: null }) { currentRole firstName id lastName location phone summary} }',
    }, {
      // Add user to context
      contextValue: {
        user: globalUser,
      },
    });
    expect(response.body.singleResult.errors).toBeUndefined();
    const data = response.body.singleResult.data.addBasics;
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('firstName');
    expect(data).toHaveProperty('lastName');
    expect(data).toHaveProperty('currentRole');
    expect(data).toHaveProperty('location');
    expect(data).toHaveProperty('phone');
    expect(data).toHaveProperty('summary');
    const getResponse = await apolloTestServer.server.executeOperation({
      query: 'query Query { basics { currentRole firstName id lastName location phone summary  } }',
    }, {
      // Add user to context
      contextValue: {
        user: globalUser,
      },
    });
    expect(getResponse.body.singleResult.errors).toBeUndefined();
    const getData = getResponse.body.singleResult.data.basics;
    expect(getData).toHaveProperty('id');
    expect(getData).toHaveProperty('firstName');
    expect(getData).toHaveProperty('lastName');
    expect(getData).toHaveProperty('currentRole');
    expect(getData).toHaveProperty('location');
    expect(getData).toHaveProperty('phone');
    expect(getData).toHaveProperty('summary');
  });

  test('[Basics]: Get Basics - User doesn\'t have basics data', async () => {
    const userResponse = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "getbasics2@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    expect(userResponse.body.singleResult.errors).toBeUndefined();
    const globalUser = await User.findById(userResponse.body.singleResult.data.registerUser.id);
    const getResponse = await apolloTestServer.server.executeOperation({
      query: 'query Query { basics { currentRole firstName id lastName location phone summary  } }',
    }, {
      // Add user to context
      contextValue: {
        user: globalUser,
      },
    });
    expect(getResponse.body.singleResult.data.basics).toBeNull();
  });

  test('[Basics]: Delete Basics - Happy Path', async () => {
    const userResponse = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "deletebasics1@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    expect(userResponse.body.singleResult.errors).toBeUndefined();
    const globalUser = await User.findById(userResponse.body.singleResult.data.registerUser.id);
    const response = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { addBasics( basicsInput: { currentRole: "test" firstName: "test" lastName: "test" location: null phone: "8867834648" summary: null }) { currentRole firstName id lastName location phone summary} }',
    }, {
      // Add user to context
      contextValue: {
        user: globalUser,
      },
    });
    const updatedUser = await User.findById(globalUser.id);
    expect(response.body.singleResult.errors).toBeUndefined();
    const data = response.body.singleResult.data.addBasics;
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('firstName');
    expect(data).toHaveProperty('lastName');
    expect(data).toHaveProperty('currentRole');
    expect(data).toHaveProperty('location');
    expect(data).toHaveProperty('phone');
    expect(data).toHaveProperty('summary');
    const delResponse = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { deleteBasics }',
    }, {
      // Add user to context
      contextValue: {
        user: updatedUser,
      },
    });
    expect(delResponse.body.singleResult.errors).toBeUndefined();
    expect(delResponse.body.singleResult.data.deleteBasics).toBeTruthy();
  });

  test('[Basics]: Delete Basics - No Basics Data', async () => {
    const userResponse = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { registerUser(registerInput: { email: "deletebasics2@gmail.com"  username: "pinnheads" password: "test123123" }) { id username email password token isAdmin } }',
    });
    expect(userResponse.body.singleResult.errors).toBeUndefined();
    const globalUser = await User.findById(userResponse.body.singleResult.data.registerUser.id);
    const delResponse = await apolloTestServer.server.executeOperation({
      query: 'mutation Mutation { deleteBasics }',
    }, {
      // Add user to context
      contextValue: {
        user: globalUser,
      },
    });
    expect(delResponse.body.singleResult.errors).toBeDefined();
  });
});
