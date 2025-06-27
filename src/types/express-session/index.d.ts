import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: number | string;
    isAdmin?: boolean;
    loginSuccess?: boolean;
    lang?: string;
  }
}