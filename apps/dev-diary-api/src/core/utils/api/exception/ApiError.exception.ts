import { HttpException, InternalServerErrorException } from '@nestjs/common';
import {
  TExceptionErrorPayload,
  TExceptionErrorResponse,
} from '@repo/types/api';

export class ApiException
  extends HttpException
  implements TExceptionErrorResponse
{
  readonly success: false;
  readonly error_code: string;
  readonly metadata: Record<string, any>;
  readonly status_code: number;
  readonly message: string;
  readonly timestamp: string;
  readonly data: null;
  readonly path: string;

  constructor({
    message = '',
    error_code,
    status_code,
    metadata = {},
  }: TExceptionErrorPayload) {
    super(
      {
        success: false,
        message,
        error_code,
        data: null,
        metadata,
      },
      status_code,
    );

    this.error_code = error_code;
    this.metadata = metadata;
    this.status_code = status_code;
    this.message = message;
  }

  getStatus(): number {
    return this.status_code;
  }
}

export class InternalServerError extends InternalServerErrorException {
  constructor(message: string) {
    super(message);
  }
}
