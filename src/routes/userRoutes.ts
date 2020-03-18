import { Router } from "express";
import { UserController } from "../controllers/userController";
import { AuthController } from "../controllers/authController";
export class UserRoutes {

    router: Router;
    public userController: UserController = new UserController();
    public authController: AuthController = new AuthController();

    constructor() {
        this.router = Router();
        this.routes();
    }
    routes() {
        this.router.post("/register", this.userController.registerUser);
        this.router.post("/login", this.userController.authenticateUser);
        this.router.get("/", this.authController.authenticateJWT, this.userController.getUsers);
        this.router.get("/:id", this.authController.authenticateJWT, this.userController.getUser);
        this.router.put("/:id", this.authController.authenticateJWT, this.userController.updateUser);
        this.router.delete("/:id", this.authController.authenticateJWT, this.userController.deleteUser);
    }
}