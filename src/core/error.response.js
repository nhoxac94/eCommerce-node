'use strict';

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
};

const ReasonStatusCode = {
  FORBIDDEN: 'Bad request error',
  CONFLICT: 'Conflict error',
};

class ErrorResponse extends Error {
  constructor(message, status) {
    supper(message);
    this.status = status;
  }
}

class ConflictResponseError extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
    supper(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
    supper(message, statusCode);
  }
}

module.exports = {
  ConflictResponseError,
  BadRequestError,
};
