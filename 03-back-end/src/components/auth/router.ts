import * as express from "express";
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from "../../common/IRouter.interface";
import AuthController from "./controller";

export default class AuthRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources){
        const authController: AuthController = new AuthController(resources);

        application.post("/auth/administrator/login", authController.administratorLogin.bind(authController));
    }
}