import UserService from "../services/user.service.js";

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json({ status: "success", payload: users });
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      res
        .status(500)
        .json({ status: "error", message: "Error al obtener usuarios" });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) {
        return res
          .status(404)
          .json({ status: "error", message: "Usuario no encontrado" });
      }
      res.json({ status: "success", payload: user });
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      res
        .status(500)
        .json({ status: "error", message: "Error al obtener el usuario" });
    }
  }

  async updateUser(req, res) {
    try {
      const updatedUser = await UserService.updateUser(req.params.id, req.body);
      if (!updatedUser) {
        return res
          .status(404)
          .json({ status: "error", message: "Usuario no encontrado" });
      }
      res.json({ status: "success", payload: updatedUser });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      res
        .status(500)
        .json({ status: "error", message: "Error al actualizar usuario" });
    }
  }

  async deleteUser(req, res) {
    try {
      const deletedUser = await UserService.deleteUser(req.params.id);
      if (!deletedUser) {
        return res
          .status(404)
          .json({ status: "error", message: "Usuario no encontrado" });
      }
      res.json({
        status: "success",
        message: "Usuario eliminado correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      res
        .status(500)
        .json({ status: "error", message: "Error al eliminar usuario" });
    }
  }

  async changeUserPassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const result = await UserService.changeUserPassword(
        req.params.id,
        oldPassword,
        newPassword
      );

      if (result.error) {
        return res.status(400).json({ status: "error", message: result.error });
      }

      res.json({
        status: "success",
        message: "Contraseña cambiada correctamente",
      });
    } catch (error) {
      console.error("Error al cambiar la contraseña del usuario:", error);
      res
        .status(500)
        .json({ status: "error", message: "Error al cambiar la contraseña" });
    }
  }

  async updateUserRole(req, res) {
    try {
      const { role } = req.body;
      const updatedUser = await UserService.updateUserRole(req.params.id, role);
      if (!updatedUser) {
        return res
          .status(404)
          .json({ status: "error", message: "Usuario no encontrado" });
      }
      res.json({ status: "success", payload: updatedUser });
    } catch (error) {
      console.error("Error al actualizar el rol del usuario:", error);
      res.status(500).json({
        status: "error",
        message: "Error al actualizar el rol del usuario",
      });
    }
  }
}

export default new UserController();
