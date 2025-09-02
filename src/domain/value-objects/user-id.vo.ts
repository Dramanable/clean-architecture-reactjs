export class UserId {
  private readonly value: string

  constructor(id: string) {
    if (!this.isValid(id)) {
      throw new Error('Invalid user ID format')
    }
    this.value = id
  }

  private isValid(id: string): boolean {
    return typeof id === 'string' && id.length > 0 && id.length <= 50
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: UserId): boolean {
    return this.value === other.value
  }

  public toString(): string {
    return this.value
  }

  public static generate(): UserId {
    // Simple UUID-like generation for demo purposes
    const timestamp = Date.now().toString(36)
    const randomPart = Math.random().toString(36).substring(2)
    return new UserId(`${timestamp}-${randomPart}`)
  }
}
