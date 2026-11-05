const requiredServerVariables = [
  "DATABASE_URL",
  "NEON_AUTH_BASE_URL",
  "NEON_AUTH_COOKIE_SECRET",
  "ONECLICK_API_BASE_URL",
] as const;

type RequiredServerVariable = (typeof requiredServerVariables)[number];

export function readServerEnv(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): Record<RequiredServerVariable, string> {
  const missing = requiredServerVariables.filter((key) => !environment[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required server environment variables: ${missing.join(", ")}`,
    );
  }

  return Object.fromEntries(
    requiredServerVariables.map((key) => [key, environment[key] as string]),
  ) as Record<RequiredServerVariable, string>;
}
