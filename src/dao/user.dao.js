import userModel from "../models/user.model.js";

class UserDAO {
  async getAllUsers() {
    return await userModel.find();
  }

  async createUser(userData) {
    const newUser = new userModel(userData);
    return await newUser.save();
  }

  async getUserByEmail(email) {
    return await userModel.findOne({ email });
  }

  async getUserById(id) {
    return await userModel.findById(id);
  }

  async getUserByPhone(phone) {
    return await userModel.findOne({ phone });
  }
  
  async getUserByToken(token) {
    return await userModel.findOne({ resetPasswordToken: token });
  }

  async updateUser(id, userData) {
    return await userModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async updateUserPassword(id, hashedPassword) {
    return await userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
  }

  async updateUserRole(id, role) {
    return await userModel.findByIdAndUpdate(id, { role }, { new: true });
  }

  async deleteUser(id) {
    return await userModel.findByIdAndDelete(id);
  }
}

export default new UserDAO();
