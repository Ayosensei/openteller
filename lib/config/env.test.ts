import { describe, expect, it } from "vitest";

import { readServerEnv } from "./env";

describe("readServerEnv", () => {
  it("returns the required server configuration", () => {
    const environment = {
      DATABASE_URL: "postgresql://example.invalid/openteller",
      NEON_AUTH_BASE_URL: "https://example.invalid/auth",
      NEON_AUTH_COOKIE_SECRET: "test-only-cookie-secret-at-least-32-characters",
      ONECLICK_API_BASE_URL: "https://example.invalid/1click",
    };

    expect(readServerEnv(environment)).toEqual(environment);
  });

  it("names every missing variable without printing any values", () => {
    expect(() => readServerEnv({})).toThrowError(
      "Missing required server environment variables: DATABASE_URL, NEON_AUTH_BASE_URL, NEON_AUTH_COOKIE_SECRET, ONECLICK_API_BASE_URL",
    );
  });
});
