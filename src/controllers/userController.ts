import bcrypt from "bcrypt-nodejs";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import passport from "passport";
import "../auth/passportHandler";
import { User } from "../models/user";
import { JWT_SECRET } from "../util/secrets";


export class UserController {

  public async registerUser(req: Request, res: Response): Promise<void> {
    try {
      await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.email,
        meta: req.body.meta
      });

      const token = jwt.sign({ username: req.body.username, scope: req.body.scope }, JWT_SECRET);
      res.status(200).send({ token: token });
    } catch (e) {
      res.status(500).send(e);
    }
  }

  public authenticateUser(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("local", function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ status: "error", code: "unauthorized" });
      } else {
        const token = jwt.sign({ username: user.username }, JWT_SECRET);
        res.status(200).send({ token: token });
      }
    });

  }
  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.get();
      res.json({ users });
    } catch (error) {
      res.sendStatus(500);
    }
  }

  public async getUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.get(req.params.id);
      if (user === null) {
        res.sendStatus(404);
      } else {
        res.json(user);
      }
    } catch (error) {
      res.sendStatus(500);
    }

  }
  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      await User.update(req.params.id, req.body);
      res.json({ response: "User updated Successfully" });
    } catch (error) {
      res.sendStatus(500);
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      await User.delete(req.params.id);
      res.json({ response: "User deleted Successfully" });
    } catch (error) {
      res.sendStatus(500);
    }
  }





}