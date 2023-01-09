import { LoginHandler } from "../../app/Handlers/LoginHandler";
import { HTTP_CODES, HTTP_METHODS } from "../../app/Models/ServerModels";

describe("LoginHandler test suite", () => {
  let loginHandler: LoginHandler;

  const requestMock = {
    method: "",
  };
  const responseMock = {
    writeHead: jest.fn(),
  };
  const authorizerMock = {};

  beforeEach(() => {
    loginHandler = new LoginHandler(
      requestMock as any, // In production making an any type would be wrong, but for unit testing may be ok
      responseMock as any, // In production making an any type would be wrong, but for unit testing may be ok
      authorizerMock as any // In production making an any type would be wrong, but for unit testing may be ok
    );
  });

  // Your test should be independent from one another, so it's a good idea to clear all mocks after each test.
  afterEach(()=>{
    jest.clearAllMocks();
  })

  test("options request", async () => {
    requestMock.method = HTTP_METHODS.OPTIONS;
    await loginHandler.handleRequest();
    expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK);
  });

  test('not handled http method', async () =>{
    requestMock.method = 'someRandomMethod';
    await loginHandler.handleRequest();

    expect(responseMock.writeHead).not.toHaveBeenCalled();

    // THE CODE BELLOW TEST THE SAME THING OF THE CODE_LINE ABOVE!
    // MY APPROACH WAS TO CHECK FOR EVERY CASE OF THE SWITCH CASE IN handleRequest 
    // TO NOT HAVE WRITTEN THE HTTP_CODES SPECIFIED IN EACH PRIVATE METHOD CALLED 
    // BY THE FUNCTION.
    expect(responseMock.writeHead).not.toHaveBeenCalledWith(HTTP_CODES.OK);
    expect(responseMock.writeHead).not.toHaveBeenCalledWith(HTTP_CODES.CREATED);
  })
});
