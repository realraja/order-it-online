import { NextResponse } from "next/server";

export const successResponse = (
  message = "Operation successful",
  data = null,
  statusCode = 200,
  metadata = null,
  headers = {},
) => {
  const responseBody = {
    success: true,
    message,
    data,
    ...(metadata && { metadata }),
  };

  return NextResponse.json(responseBody, {
    status: statusCode,
    headers,
  });
};

export const failedResponse = (
  message = "Operation failed",
  data = null,
  statusCode = 400,
  metadata = null,
  headers = {},
) => {
  const responseBody = {
    success: false,
    message,
    data,
    ...(metadata && { metadata }),
  };

  return NextResponse.json(responseBody, {
    status: statusCode,
    headers,
  });
};

export const errorResponse = (
  message = "Internal server error",
  error = null,
  status = 500,
  errorCode = null,
  metadata = null,
  headers = {},
) => {
  const responseBody = {
    success: false,
    message,
    ...(error && { error }),
    ...(errorCode && { errorCode }),
    ...(metadata && { metadata }),
  };

  // Log server errors (500+)
  if (status >= 500) {
    console.log("Server Error:", {
      message,
      error,
      errorCode,
      status,
    });
  }

  return NextResponse.json(responseBody, {
    status,
    headers,
  });
};

// Aliases for backward compatibility
export const ResponseSuccess = successResponse;
export const ResponseFailed = failedResponse;
export const ResponseFailedError = errorResponse;
