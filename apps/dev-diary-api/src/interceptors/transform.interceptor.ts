import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TApiResponseSuccess } from '@repo/types/api';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, TApiResponseSuccess<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<TApiResponseSuccess<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    return next
      .handle()
      .pipe(map((data) => this.formatResponse(data, request)));
  }

  private formatResponse(data: T, request: Request): TApiResponseSuccess<T> {
    return {
      success: true,
      data,
      message: 'success',
      metadata: {},
    };
  }
}
