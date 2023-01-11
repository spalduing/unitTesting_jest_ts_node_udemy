import { Authorizer } from "../../app/Authorization/Authorizer";
import { SessionTokenDBAccess } from "../../app/Authorization/SessionTokenDBAccess";
import { UserCredentialsDbAccess } from "../../app/Authorization/UserCredentialsDbAccess";
import {
  AccessRight,
  Account,
  SessionToken,
  UserCredentials,
} from "../../app/Models/ServerModels";

jest.mock("../../app/Authorization/SessionTokenDBAccess");
jest.mock("../../app/Authorization/UserCredentialsDbAccess");

const someAccount: Account = {
    username: "someUser",
    password: "password",
  };

describe("Authorizer test suite", () => {
  let authorizer: Authorizer;

  const sessionTokenDBAccessMock = {
    storeSessionToken: jest.fn(),
  };
  const userCredentialsDBAccessMock = {
    getUserCredential: jest.fn(),
  };

  beforeEach(() => {
    authorizer = new Authorizer(
      sessionTokenDBAccessMock as any,
      userCredentialsDBAccessMock as any
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("constructor arguments", () => {
    new Authorizer(
    );
    expect(SessionTokenDBAccess).toBeCalled();
    expect(UserCredentialsDbAccess).toBeCalled();
  });


  test("should return session token for valid credentials", async () => {
    jest.spyOn(global.Math, "random").mockReturnValueOnce(0);
    jest.spyOn(global.Date, "now").mockReturnValueOnce(0);

    userCredentialsDBAccessMock.getUserCredential.mockReturnValue({
      accessRights: [AccessRight.CREATE, AccessRight.READ],
      username: "someUser",
      password: "password",
    });

    const expectedSessionToken: SessionToken = {
      accessRights: [AccessRight.CREATE, AccessRight.READ],
      userName: "someUser",
      valid: true,
      expirationTime: new Date(60 * 60 * 1000),
      tokenId: "",
    };

    const sessionToken = await authorizer.generateToken(someAccount);

    expect(sessionToken).toEqual(expectedSessionToken);
    expect(sessionTokenDBAccessMock.storeSessionToken).toHaveBeenCalledWith(sessionToken);
  });
});
