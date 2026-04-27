declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT?: string;
        NODE_ENV?: 'development' | 'production' | 'test';
        FRONTEND_URL?: string;
        SUPABASE_URL: string;
        SUPABASE_SERVICE_ROLE_KEY: string;
        JWT_SECRET?: string;
      }
    }
  }
  
  export {};