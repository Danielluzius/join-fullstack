import { HttpInterceptorFn } from '@angular/common/http';

/**
 * HTTP Interceptor that adds the authentication token to all outgoing requests.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');

  // If token exists and request is to our API, add Authorization header
  if (token && req.url.includes('/api/')) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Token ${token}`,
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};
