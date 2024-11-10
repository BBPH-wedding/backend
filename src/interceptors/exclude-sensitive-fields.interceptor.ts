import { CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeSensitiveFieldsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((item) => this.excludeFields(item));
        }
        return this.excludeFields(data);
      }),
    );
  }

  private excludeFields(reservation: any) {
    if (reservation && typeof reservation === 'object') {
      const { password, confirmationToken, ...rest } = reservation;
      return rest;
    }
    return reservation;
  }
}
