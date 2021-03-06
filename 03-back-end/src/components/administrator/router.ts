import IRouter from '../../common/IRouter.interface';
import express = require('express');
import IApplicationResources from '../../common/IApplicationResources.interface';
import AdministratorController from './controller';

export default class AdministratorRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources){
        const administratorController = new AdministratorController(resources);

        application.get("/administrator",     administratorController.getAll.bind(administratorController));
        application.get("/administrator/:id", administratorController.getById.bind(administratorController));
        application.post("/administrator",    administratorController.add.bind(administratorController));
        application.put("/administrator/:id", administratorController.edit.bind(administratorController));
        application.delete("/administrator/:id", administratorController.delete.bind(administratorController));
    }
}