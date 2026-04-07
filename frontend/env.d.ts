declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "production" | "test";
    CI?: string;
    NEXT_RUNTIME?: "nodejs" | "edge";
    NEXT_PUBLIC_API_URL?: string;
    NEXT_PUBLIC_SITE_URL?: string;
    NEXT_PUBLIC_SENTRY_DSN?: string;
    SENTRY_DSN?: string;
    SENTRY_ORG?: string;
    SENTRY_PROJECT?: string;
  }
}
