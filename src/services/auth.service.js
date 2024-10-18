import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserDAO from "../dao/user.dao.js";

class AuthService {
  async login(email, password) {
    const user = await UserDAO.getUserByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error("Email o contraseña incorrectos");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    return token;
  }

  async register(userData) {
    const { email, password } = userData;

    const existingUser = await UserDAO.getUserByEmail(email);
    if (existingUser) {
      throw new Error("El usuario ya existe");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await UserDAO.createUser({
      ...userData,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    return token;
  }
}

export default new AuthService();