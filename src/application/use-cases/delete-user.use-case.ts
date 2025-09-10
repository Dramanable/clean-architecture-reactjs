import { UserError } from "../../domain/exceptions/user.error";
import type { UserRepository } from "../../domain/repositories/user.repository";
import i18n from "../../i18n";

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    // Vérifier si l'utilisateur existe
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) throw new UserError(i18n.t("errors.userNotFound"));

    try {
      await this.userRepository.delete(id);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new UserError(i18n.t("errors.userDeleteFailed"));
    }
  }
}
