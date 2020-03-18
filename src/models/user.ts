import { IUser } from "../interfaces/user.interface";
import bcrypt from "bcrypt-nodejs";


// create store...
const { Store } = require("fs-json-store");

class UserModel {
  public store: any;
  constructor() {
    this.store = new Store({ file: "data.json" });
  }
  private getId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  private validate(user: Partial<IUser>) {
    if (!user.email) {
      throw new Error("email should not be black");
    }
    if (!user.phone) {
      throw new Error("phone should not be black");
    }
    if (!user.firstName) {
      throw new Error("firstName should not be black");
    }
    if (!user.lastName) {
      throw new Error("lastName should not be black");
    }
    if (!user.password) {
      throw new Error("password should not be black");
    }
    return user;
  }
  async createPasswordHash(str: string) {
    return bcrypt.hash(str, "10", (err: Error, hash: string) => {
      if (err) throw err;
      return hash;
    });
  }
  async create(user: Partial<IUser>) {
    const passwordHash = await this.createPasswordHash(user.password);
    return this.store.write(this.validate(Object.assign(user, { id: this.getId(), password: passwordHash })));
  }
  async getUserByEmail(email: string) {
    const users = await this.store.read();
    return users.find((u: IUser) => u.email === email);
  }
  async update(id: string, data: Partial<IUser>) {
    const users = await this.store.read();
    return this.store.write(users.map((u: IUser) => u.id === id ? this.validate(Object.assign(u, data)) : u));
  }
  async delete(id: string) {
    const users = await this.store.read();
    return this.store.write(users.map((u: IUser) => u.id !== id));
  }
  async get(id: string = "") {
    if (id) {
      const users = await this.store.read();
      return users.find((u: IUser) => u.id === id);
    }
    return this.store.read();
  }
  async comparePassword(user: IUser, candidatePassword: string) {
    return bcrypt.compare(candidatePassword, user.password, (err: Error, isMatch: boolean) => {
      if (err) throw err;
      return isMatch;
    });
  }

}
export const User = new UserModel();