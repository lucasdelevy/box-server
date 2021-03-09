const email = "lucasdelevy@gmail.com";
const password = "abc123";
const token = "12341234";
const hash = "abcdabcd";

describe("authentication tests", () => {
  beforeAll(() => {
    setupGenerateHashAndTokenMock();
    setupDDBMock(true, { Item: { hash: { S: "test" } } });
    setupBcrypt();
  });

  it("does saveLogin", async () => {
    // setup
    const { saveLogin } = require("../../../src/graphql/resolvers/auth");

    // trigger
    result = await saveLogin(email, password);

    // validate
    expect.assertions(1);
    expect(result).toEqual({ couldSave: true, token });
  });

  it("does confirmLogin", async () => {
    // setup
    const { confirmLogin } = require("../../../src/graphql/resolvers/auth");

    // trigger
    result = await confirmLogin(email, password);

    // validate
    expect.assertions(1);
    expect(result).toEqual({ authenticated: true, token });
  });

  const setupGenerateHashAndTokenMock = () => {
    // setup generateHash and generateToken
    jest.mock("../../../src/helpers/authHelper");
    const {
      generateHash,
      generateToken,
    } = require("../../../src/helpers/authHelper");

    generateHash.mockImplementation(() => hash);
    generateToken.mockImplementation(() => token);
  };

  const setupDDBMock = (mockPutResponseObj, mockGetResponseObj) => {
    jest.mock("aws-sdk", () => {
      return {
        DynamoDB: jest.fn(() => {
          return {
            putItem: jest.fn(() => {
              return {
                promise: jest.fn(() => mockPutResponseObj),
              };
            }),
            getItem: jest.fn(() => {
              return {
                promise: jest.fn(() => mockGetResponseObj),
              };
            }),
          };
        }),
      };
    });
  };

  const setupBcrypt = () => {
    jest.mock("bcrypt");
    const bcrypt = require("bcrypt");
    bcrypt.compare.mockImplementation(() => Promise.resolve(true));
  };
});
