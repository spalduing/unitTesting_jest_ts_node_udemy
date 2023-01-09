import { Utils } from "../app_legacy/Utils";

describe.only("Utils test suite", () => {
  beforeEach(() => {
    console.log("before each");
  });

  beforeAll(() => {
    console.log("before All");
  });

  test.only("first test", () => {
    // It will going to skip this test when jest run the test suit.
    const result = Utils.toUpperCase("s");
    expect(result).toBe("S");
    console.log(`test work!! [${result}]`);
  });

  test("parse simple URL", () => {
    const parsedUrl = Utils.parseUrl("http://localhost:8080/login");
    expect(parsedUrl.href).toBe("http://localhost:8080/login");
    expect(parsedUrl.port).toBe("8080");
    expect(parsedUrl.protocol).toBe("http:");
    expect(parsedUrl.query).toEqual({});
  });

  test("parse URL with query", () => {
    const parsedUrl = Utils.parseUrl(
      "http://localhost:8080/login?user=user&password=password"
    );
    const expectedQuery = {
      user: "user",
      password: "password",
    };
    expect(parsedUrl.query).toEqual(expectedQuery);
    expect(expectedQuery).toBe(expectedQuery);
  });

  test.todo("TODO test");

  test.only("test invalid URL", () => {
    function expectError() {
      Utils.parseUrl("");
    }
    expect(expectError).toThrowError("Empty url"); // Even if the msg is not correctly spelled, the test should pass without problem
  });

  test.only("test invalid URL with arrow function", () => {
    expect(() => {
      Utils.parseUrl("");
    }).toThrowError("Empty url"); // Even if the msg is not correctly spelled, the test should pass without problem
  });

  test.only("test invalid URL with try catch", () => {
    try {
      Utils.parseUrl("");
    } catch (error) {
        expect(error).toBeInstanceOf(Error); 
        expect(error).toHaveProperty('message', 'Empty url!')
    }
  });


});
