import 'express-session';

declare module 'express-session' {
  interface SessionData {
    lang?: string;
    userId?: string | number;
    isAdmin?: boolean;
    loginSuccess?: boolean;
  }
}