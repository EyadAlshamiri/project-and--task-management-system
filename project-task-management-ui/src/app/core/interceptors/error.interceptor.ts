import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(NzMessageService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'حدث خطأ غير متوقع في الخادم.';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMsg = `خطأ في الاتصال: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 0) {
          errorMsg = 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.';
        } else if (error.status >= 400 && error.status < 500) {
          errorMsg = error.error?.message || `خطأ في الطلب (${error.status})`;
        } else if (error.status >= 500) {
          errorMsg = `خطأ في الخادم (${error.status}): يرجى المحاولة لاحقاً.`;
        }
      }
      
      messageService.error(errorMsg);
      return throwError(() => error);
    })
  );
};
