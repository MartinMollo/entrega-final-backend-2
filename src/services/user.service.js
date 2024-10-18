import UserDAO from "../dao/user.dao.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserService {
  async login(email, password) {
    const user = await UserDAO.getUserByEmail(email);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      throw new Error("Contraseña incorrecta");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "5h",
      }
    );

    return token;
  }

  async getUserByEmail(email) {
    const user = await UserDAO.getUserByEmail(email);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  }
  
  async register(userData) {
    const { email, password, phone, ...otherData } = userData;

    const existingUser = await UserDAO.getUserByEmail(email);
    if (existingUser) {
      throw new Error("El correo electrónico ya está registrado");
    }

    const existingPhone = await UserDAO.getUserByPhone(phone);
    if (existingPhone) {
      throw new Error("El número de teléfono ya está registrado");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      email,
      password: hashedPassword,
      phone,
      ...otherData
    };

    const createdUser = await UserDAO.createUser(newUser);

    const token = jwt.sign({ id: createdUser._id, email: createdUser.email }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    return token;
  }

  async getAllUsers() {
    return await UserDAO.getAllUsers();
  }

  async createUser(userData) {
    const { email, password, ...otherData } = userData;

    const existingUser = await UserDAO.getUserByEmail(email);
    if (existingUser) {
      throw new Error("El correo electrónico ya está registrado");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      email,
      password: hashedPassword,
      ...otherData,
    };

    return await UserDAO.createUser(newUser);
  }

  async getUserByToken(token) {
    const user = await UserDAO.getUserByToken(token);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  }

  async hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  async getUserById(id) {
    const user = await UserDAO.getUserById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  }

  async updateUser(id, userData) {
    const user = await UserDAO.getUserById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return await UserDAO.updateUser(id, userData);
  }

  async deleteUser(id) {
    const user = await UserDAO.getUserById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return await UserDAO.deleteUser(id);
  }

  async changeUserPassword(id, oldPassword, newPassword) {
    const user = await UserDAO.getUserById(id);
    if (!user) {
      return { error: "Usuario no encontrado" };
    }

    const isValidPassword = bcrypt.compareSync(oldPassword, user.password);
    if (!isValidPassword) {
      return { error: "La contraseña actual es incorrecta" };
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    return { success: true };
  }

  async updateUserRole(id, role) {
    const user = await UserDAO.getUserById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    user.role = role;
    await user.save();
    return user;
  }
}

export default new UserService();
