// Exceptions liées à l'authentification dans le domaine

export class AuthenticationError extends Error {
  constructor(message: string = 'Erreur d\'authentification') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class InvalidCredentialsError extends AuthenticationError {
  constructor(message: string = 'Identifiants invalides') {
    super(message)
    this.name = 'InvalidCredentialsError'
  }
}

export class TokenExpiredError extends AuthenticationError {
  constructor(message: string = 'Token expiré') {
    super(message)
    this.name = 'TokenExpiredError'
  }
}

export class UnauthorizedError extends AuthenticationError {
  constructor(message: string = 'Non autorisé') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class SessionExpiredError extends AuthenticationError {
  constructor(message: string = 'Session expirée') {
    super(message)
    this.name = 'SessionExpiredError'
  }
}
