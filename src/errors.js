import {
  ErrorType
} from 'netiam-errors'

export const AUTH_ERROR = new ErrorType('Auth error.', 400, 'AUTH_ERROR', 4000)
export const AUTH_INVALID_USERNAME = new ErrorType('Invalid username.', 400, 'AUTH_INVALID_USERNAME', 4001)
export const AUTH_INVALID_PASSWORD = new ErrorType('Invalid password.', 400, 'AUTH_INVALID_PASSWORD', 4002)
export const AUTH_TOKEN_EXPIRED = new ErrorType('Token is expired.', 400, 'AUTH_TOKEN_EXPIRED', 4003)
export const AUTH_INVALID_TOKEN = new ErrorType('Invalid token.', 400, 'AUTH_INVALID_TOKEN', 4004)
export const AUTH_TOKEN_OWNER_MISMATCH = new ErrorType('Token owner mismatch.', 400, 'AUTH_TOKEN_OWNER_MISMATCH', 4005)
