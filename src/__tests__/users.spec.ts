import * as validator from "express-validator";
import * as helpers from "../utils/helpers.js";
import { getUserByIdHandler, createUserHandler } from "../handlers/users.js";
import { IUsersRepo } from "../data/usersRepo.js";

const mockUsersRepo: IUsersRepo = {
  findById: jest.fn(),
  findByUsername: jest.fn(),
  createUser: jest.fn(),
  verifyPassword: jest.fn(),
};

jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => false),
    array: jest.fn(() => [{ msg: "Invalid Field" }]),
  })),
  matchedData: jest.fn(() => ({
    username: "test",
    password: "password",
    displayName: "test_name",
  })),
}));

jest.mock("../utils/helpers.js", () => ({
  hashPassword: jest.fn((password) => `hashed_${password}`),
}));

const mockResponse = {
  sendStatus: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
};

describe("get users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get user by id", async () => {
    const mockRequestWithId: any = { params: { id: "2" } };
    (mockUsersRepo.findById as jest.Mock).mockResolvedValueOnce({
      id: 2,
      username: "jack",
      displayName: "Jack",
      password: "hello124",
    });
    await getUserByIdHandler(mockUsersRepo)(mockRequestWithId, mockResponse as any);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalledWith({
      id: 2,
      username: "jack",
      displayName: "Jack",
      password: "hello124",
    });
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
  });

  it("should call sendStatus with 404 when user not found", async () => {
    const mockRequestWithId: any = { params: { id: "999" } };
    (mockUsersRepo.findById as jest.Mock).mockResolvedValueOnce(null);
    await getUserByIdHandler(mockUsersRepo)(mockRequestWithId, mockResponse as any);
    expect(mockResponse.sendStatus).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
  });
});

describe("create users", () => {
  const mockRequestForCreate = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return status of 400 when there are errors", async () => {
    await createUserHandler(mockUsersRepo)(mockRequestForCreate as any, mockResponse as any);
    expect(validator.validationResult).toHaveBeenCalled();
    expect(validator.validationResult).toHaveBeenCalledWith(mockRequestForCreate);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith([{ msg: "Invalid Field" }]);
  });

  it("should return status of 201 and the user created", async () => {
    jest.spyOn(validator, "validationResult").mockImplementationOnce(
      () =>
        ({
          isEmpty: jest.fn(() => true),
        }) as any
    );

    (mockUsersRepo.createUser as jest.Mock).mockResolvedValueOnce({
      id: 1,
      username: "test",
      password: "hashed_password",
      displayName: "test_name",
    });
    await createUserHandler(mockUsersRepo)(mockRequestForCreate as any, mockResponse as any);
    expect(validator.matchedData).toHaveBeenCalledWith(mockRequestForCreate);
    expect(helpers.hashPassword).toHaveBeenCalledWith("password");
    expect(helpers.hashPassword).toHaveReturnedWith("hashed_password");
    expect(mockUsersRepo.createUser).toHaveBeenCalledWith({
      username: "test",
      password: "hashed_password",
      displayName: "test_name",
    });
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith({
      id: 1,
      username: "test",
      password: "hashed_password",
      displayName: "test_name",
    });
  });

  it("send status of 400 when database fails to save user", async () => {
    jest.spyOn(validator, "validationResult").mockImplementationOnce(
      () =>
        ({
          isEmpty: jest.fn(() => true),
        }) as any
    );
    (mockUsersRepo.createUser as jest.Mock).mockImplementationOnce(() =>
      Promise.reject("Failed to save user")
    );
    await createUserHandler(mockUsersRepo)(mockRequestForCreate as any, mockResponse as any);
    expect(mockUsersRepo.createUser).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
  });
});
