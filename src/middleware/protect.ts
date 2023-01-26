import express from "express";
import createError from "http-errors";

export async function protect(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if(!req.session.user) {
    return next(createError(401));
  }
  
  next();
}
