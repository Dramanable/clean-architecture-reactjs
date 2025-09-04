// Exceptions liées aux utilisateurs dans le domaine

export class UserError extends Error {
  constructor(message: string = 'Erreur utilisateur') {
    super(message)
    this.name = 'UserError'
  }
}

export class UserNotFoundError extends UserError {
  constructor(userId?: string) {
    const message = userId 
      ? `Utilisateur avec l'ID ${userId} non trouvé`
      : 'Utilisateur non trouvé'
    super(message)
    this.name = 'UserNotFoundError'
  }
}

export class UserAlreadyExistsError extends UserError {
  constructor(email?: string) {
    const message = email 
      ? `Un utilisateur avec l'email ${email} existe déjà`
      : 'Cet utilisateur existe déjà'
    super(message)
    this.name = 'UserAlreadyExistsError'
  }
}

export class InvalidUserDataError extends UserError {
  constructor(message: string = 'Données utilisateur invalides') {
    super(message)
    this.name = 'InvalidUserDataError'
  }
}

export class UserPermissionError extends UserError {
  constructor(message: string = 'Permissions insuffisantes') {
    super(message)
    this.name = 'UserPermissionError'
  }
}
