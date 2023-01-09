import { LoginHandler } from "../../app/Handlers/LoginHandler";
import {
  AccessRight,
  HTTP_CODES,
  HTTP_METHODS,
  SessionToken,
} from "../../app/Models/ServerModels";
import { Utils } from "../../app/Utils/Utils";

describe("LoginHandler test suite", () => {
  let loginHandler: LoginHandler;

  const requestMock = {
    method: "",
  };
  const responseMock = {
    writeHead: jest.fn(),
    write: jest.fn(),
    statusCode: 0
  };
  const authorizerMock = {
    generateToken: jest.fn(),
  };

  const getRequestBodyMock = jest.fn();

  beforeEach(() => {
    loginHandler = new LoginHandler(
      requestMock as any, // In production making an any type would be wrong, but for unit testing may be ok
      responseMock as any, // In production making an any type would be wrong, but for unit testing may be ok
      authorizerMock as any // In production making an any type would be wrong, but for unit testing may be ok
    );

    Utils.getRequestBody = getRequestBodyMock;
  });

  // Your test should be independent from one another, so it's a good idea to clear all mocks after each test.
  afterEach(() => {
    jest.clearAllMocks();
  });

  const someSessionToken: SessionToken = {
    tokenId: "string",
    userName: "string",
    valid: true,
    expirationTime: new Date(),
    accessRights: [AccessRight.CREATE, AccessRight.READ],
  };

  test("options request", async () => {
    requestMock.method = HTTP_METHODS.OPTIONS;
    await loginHandler.handleRequest();
    expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK);
  });

  test("not handled http method", async () => {
    requestMock.method = "someRandomMethod";
    await loginHandler.handleRequest();

    expect(responseMock.writeHead).not.toHaveBeenCalled();

    // THE CODE BELLOW TEST THE SAME THING OF THE CODE_LINE ABOVE!
    // MY APPROACH WAS TO CHECK FOR EVERY CASE OF THE SWITCH CASE IN handleRequest
    // TO NOT HAVE WRITTEN THE HTTP_CODES SPECIFIED IN EACH PRIVATE METHOD CALLED
    // BY THE FUNCTION.
    expect(responseMock.writeHead).not.toHaveBeenCalledWith(HTTP_CODES.OK);
    expect(responseMock.writeHead).not.toHaveBeenCalledWith(HTTP_CODES.CREATED);
  });

  test("post request with valid login", async () => {
    requestMock.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockReturnValueOnce({
      username: "someUser",
      password: "password",
    });

    authorizerMock.generateToken.mockReturnValueOnce(someSessionToken);

    await loginHandler.handleRequest();
    
    expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
    expect(responseMock.write).toBeCalledWith(JSON.stringify(someSessionToken));
  });

  test("post request with invalid login", async () => {
    requestMock.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockReturnValueOnce({
      username: "someUser",
      password: "password",
    });

    authorizerMock.generateToken.mockReturnValueOnce(null);

    await loginHandler.handleRequest();
    
    expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
    expect(responseMock.write).toBeCalledWith('wrong username or password');
  });
  
  test("post request with unexpected error", async () => {
    requestMock.method = HTTP_METHODS.POST;
    const unexpectedError = new Error('something went wrong!');
    getRequestBodyMock.mockRejectedValueOnce(unexpectedError);

    await loginHandler.handleRequest();
    
    expect(responseMock.statusCode).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
    expect(responseMock.write).toBeCalledWith('Internal error: ' + unexpectedError.message);
  });
});
