import { Router } from "express";
import {
  getRegister,
  getRegisterSuccess,
  getSearch,
  postRegister,
} from "../controllers/users.controller.js";

const userRouter = Router();

userRouter.get("/register", getRegister);
userRouter.post("/register", postRegister);
userRouter.get("/register-success", getRegisterSuccess);
userRouter.get("/search", getSearch);

export default userRouter;
