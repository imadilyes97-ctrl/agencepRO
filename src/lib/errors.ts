/**
 * Error classes for Agence Pro.
 * Each class maps to a specific HTTP status and error code.
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const msg = id ? `${resource} (${id}) introuvable` : `${resource} introuvable`;
    super(msg, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Accès refusé") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Non authentifié") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ValidationError extends AppError {
  public readonly details: Record<string, string[]>;

  constructor(details: Record<string, string[]>) {
    super("Données invalides", 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
    this.details = details;
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
    this.name = "ConflictError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Trop de requêtes. Réessayez plus tard.") {
    super(message, 429, "RATE_LIMITED");
    this.name = "RateLimitError";
  }
}
