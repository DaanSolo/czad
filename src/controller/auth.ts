import express from "express";
import createError from "http-errors";
import validator from "validator";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcrypt";

class AuthController {
  static BCRYPT_ROUNDS: number = parseInt(process.env.BCRYPT_ROUNDS, 10);

  static async register(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (!validator.isEmail(req.body.email))
      return next(createError(400, "Invalid email"));
    if (!validator.isAlphanumeric(req.body.username))
      return next(createError(400, "Invalid username"));
    if (!validator.isAlpha(req.body.firstName))
      return next(createError(400, "Invalid first name"));
    if (!validator.isAlpha(req.body.firstName))
      return next(createError(400, "Invalid last name"));
    if (!validator.isStrongPassword(req.body.password, { minLength: 6 }))
      return next(createError(400, "Password too weak"));

    const isEmailTakenPromise = AppDataSource.manager.exists(User, {
      where: {
        email: req.body.email,
      },
    });
    const isUsernameTakenPromise = AppDataSource.manager.exists(User, {
      where: {
        username: req.body.username,
      },
    });

    const [isEmailTaken, isUsernameTaken] = await Promise.all([isEmailTakenPromise, isUsernameTakenPromise]);

    if (isEmailTaken)
      return next(
        createError(400, "Account with the same email address already exists")
      );
    if (isUsernameTaken)
      return next(createError(400, "Username already taken"));

    const hash = await bcrypt.hash(req.body.password, AuthController.BCRYPT_ROUNDS);

    let user = new User();
    user.email = req.body.email;
    user.username = req.body.username;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.password = hash;

    user = await AppDataSource.manager.save<User>(user);

    req.session.regenerate(() => {
      req.session.user = user;
      res.json(user);
    });

  }
}

export default AuthController;