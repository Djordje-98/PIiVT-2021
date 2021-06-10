import * as express from "express";
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from "../../common/IRouter.interface";
import AuthController from "./controller";
import AuthMiddleware from '../../middleware/auth.middleware';

export default class AuthRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources){
        const authController: AuthController = new AuthController(resources);

        application.post("/auth/administrator/login", authController.administratorLogin.bind(authController));

        application.post("/auth/administrator/refresh", authController.administratorRefresh.bind(authController));

        application.get(
            "/auth/administrator/ok",
            AuthMiddleware.getVerifier("administrator"),
            authController.sendOk.bind(authController)
            );
    }
}