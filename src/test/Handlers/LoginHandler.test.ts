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

  test("options request", async () => {
    requestMock.method = HTTP_METHODS.OPTIONS;
    await loginHandler.handleRequest();
    expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK);
  });
});
