import { NextResponse } from "next/server";

/**
 * Validates API key from request headers
 */
export function validateApiKey(request: Request): boolean {
  const apiKey = request.headers.get("x-api-key");
  const validApiKey = process.env.API_KEY;

  if (!validApiKey) {
    console.warn("API_KEY not configured in environment variables");
    return false;
  }

  return apiKey === validApiKey;
}

/**
 * Middleware to require API key authentication
 */
export function requireApiKey(request: Request): Response | null {
  if (!validateApiKey(request)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: Invalid or missing API key" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  return null;
}

const rateLimitStore = new Map<
  string,
  { count: number; resetTime: number }
>();

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100, // requests per window
  windowMs: 15 * 60 * 1000, // 15 minutes
};

const AUTHENTICATED_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 1000, // Higher limit for authenticated requests
  windowMs: 15 * 60 * 1000,
};

/**
 * Get client identifier for rate limiting
 */
function getClientId(request: Request): string {
  // Use API key if authenticated, otherwise use IP
  const apiKey = request.headers.get("x-api-key");
  if (apiKey) {
    return `api:${apiKey.substring(0, 8)}`; // Use first 8 chars for logging
  }
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  return `ip:${ip}`;
}

/**
 * Apply rate limiting to request
 */
export function rateLimit(
  request: Request,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT
): Response | null {
  const clientId = getClientId(request);
  const now = Date.now();
  const record = rateLimitStore.get(clientId);

  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return null;
  }

  if (record.count >= config.maxRequests) {
    return new Response(
      JSON.stringify({
        error: "Too many requests",
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  record.count++;
  rateLimitStore.set(clientId, record);
  return null;
}

/**
 * Combined middleware for protected endpoints
 * Requires API key and applies rate limiting
 */
export function protectApiEndpoint(request: Request): Response | null {
  // Check authentication
  const authError = requireApiKey(request);
  if (authError) return authError;

  // Apply rate limiting (higher limit for authenticated)
  return rateLimit(request, AUTHENTICATED_RATE_LIMIT);
}

/**
 * Check if the current user is a developer
 */
export async function isDeveloper(supabase: any): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("type")
    .eq("id", user.id)
    .single();

  return profile?.type === "developer";
}

/**
 * Public endpoint rate limiting (no auth required)
 */
export function rateLimitPublic(request: Request): Response | null {
  return rateLimit(request, DEFAULT_RATE_LIMIT);
}

