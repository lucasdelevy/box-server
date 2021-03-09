const email = "lucasdelevy@gmail.com";
const password = "abc123";
const token = "12341234";
const hash = "abcdabcd";

it("does saveLogin", async () => {
  // setup
  // setup generateHash and generateToken
  jest.mock("../../../src/helpers/authHelper");
  const {
    generateHash,
    generateToken,
  } = require("../../../src/helpers/authHelper");
  generateHash.mockImplementation(() => hash);
  generateToken.mockImplementation(() => token);

  // setup DDB
  jest.mock("aws-sdk", () => {
    return {
      DynamoDB: jest.fn(() => {
        return {
          putItem: jest.fn(() => {
            return {
              promise: jest.fn(() => true),
            };
          }),
          getItem: jest.fn(() => {
            return {
              promise: jest.fn(() => {
                return { Item: {} };
              }),
            };
          }),
        };
      }),
    };
  });

  //  setup saveLogin
  const { saveLogin } = require("../../../src/graphql/resolvers/auth");

  // triger
  result = await saveLogin(email, password);

  // validate
  expect.assertions(1);
  expect(result).toEqual({ couldSave: true, token });
});
