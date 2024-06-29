class GenericError extends Error {
  statusCode: number = 500;
  code: string = "GENERIC_ERROR";
  message: string = "Generic Server Error";
  constructor({ ...params }) {
    super(params.message);
    this.message = params.message;
    this.code = params.code;
    this.statusCode = params.statusCode;
  }
}

export class ResourceAlreadyExistError extends GenericError {
  constructor({
    message = "",
    code = "RESOURCE_ALREADY_EXIST",
    statusCode = 409,
  }) {
    super({ message, code, statusCode });
  }
}

export class ResourceDoesNotExistError extends GenericError {
  constructor({
    message = "",
    code = "RESOURCE_DOESNOT_EXIST",
    statusCode = 404,
  }) {
    super({ message, code, statusCode });
  }
}
